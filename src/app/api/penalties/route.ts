import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get('landlordId');
    const status = searchParams.get('status'); // 'applied', 'pending', 'waived'

    if (!landlordId) {
      return NextResponse.json(
        { error: 'Landlord ID is required' },
        { status: 400 }
      );
    }

    const where: any = {
      landlordId,
      penaltyAmount: {
        gt: 0,
      },
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const penalties = await db.payment.findMany({
      where,
      include: {
        tenant: true,
        property: true,
        lease: true,
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    // Calculate penalty statistics
    const totalPenalties = penalties.reduce((sum, p) => sum + p.penaltyAmount, 0);
    const paidPenalties = penalties
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.penaltyAmount, 0);
    const pendingPenalties = penalties
      .filter(p => p.status === 'PENDING' || p.status === 'OVERDUE')
      .reduce((sum, p) => sum + p.penaltyAmount, 0);

    return NextResponse.json({
      penalties,
      statistics: {
        totalPenalties,
        paidPenalties,
        pendingPenalties,
        totalPenaltyCount: penalties.length,
        averagePenalty: penalties.length > 0 ? totalPenalties / penalties.length : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching penalties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      paymentId,
      penaltyAmount,
      penaltyType,
      reason,
      waiveExisting = false,
    } = await request.json();

    if (!paymentId || penaltyAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        lease: true,
        tenant: true,
        property: true,
        landlord: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Calculate days overdue
    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysOverdue <= 0) {
      return NextResponse.json(
        { error: 'Payment is not overdue' },
        { status: 400 }
      );
    }

    let finalPenaltyAmount = penaltyAmount;

    // If penalty amount not provided, calculate based on rules
    if (penaltyAmount === 0) {
      // Default penalty calculation: 5% of rent amount + KES 100 per day overdue
      const percentagePenalty = payment.amount * 0.05;
      const dailyPenalty = 100 * daysOverdue;
      finalPenaltyAmount = Math.max(percentagePenalty + dailyPenalty, 500); // Minimum KES 500
    }

    // Update payment with penalty
    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        penaltyAmount: waiveExisting ? 0 : finalPenaltyAmount,
        status: daysOverdue > 7 ? 'OVERDUE' : payment.status,
        notes: waiveExisting 
          ? `Penalty waived on ${new Date().toLocaleDateString()}. Previous reason: ${reason || 'Not specified'}`
          : `${payment.notes || ''}. Penalty applied: ${reason || 'Late payment'}. Amount: KES ${finalPenaltyAmount}`,
      },
      include: {
        tenant: true,
        property: true,
        lease: true,
      },
    });

    // Create notification for landlord
    await db.notification.create({
      data: {
        title: waiveExisting ? 'Penalty Waived' : 'Penalty Applied',
        message: waiveExisting 
          ? `Penalty of KES ${payment.penaltyAmount} waived for ${payment.tenant.firstName} ${payment.tenant.lastName} - ${payment.property.title}`
          : `Penalty of KES ${finalPenaltyAmount} applied to ${payment.tenant.firstName} ${payment.tenant.lastName} - ${payment.property.title}`,
        type: waiveExisting ? 'PENALTY_WAIVED' : 'PENALTY_APPLIED',
        userId: payment.landlordId,
      },
    });

    // Send email notification to tenant if penalty applied
    if (!waiveExisting) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'OVERDUE_NOTICE',
            paymentId: paymentId,
            customMessage: `A late penalty of KES ${finalPenaltyAmount} has been applied to your payment. Reason: ${reason || 'Late payment'}.`,
          }),
        });
      } catch (error) {
        console.error('Error sending penalty notification email:', error);
      }
    }

    return NextResponse.json({
      message: waiveExisting ? 'Penalty waived successfully' : 'Penalty applied successfully',
      payment: updatedPayment,
      penaltyAmount: waiveExisting ? 0 : finalPenaltyAmount,
      daysOverdue,
    });

  } catch (error) {
    console.error('Error managing penalty:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk apply penalties for all overdue payments
export async function PUT(request: NextRequest) {
  try {
    const { landlordId, penaltyRules } = await request.json();

    if (!landlordId) {
      return NextResponse.json(
        { error: 'Landlord ID is required' },
        { status: 400 }
      );
    }

    const today = new Date();
    const overduePayments = await db.payment.findMany({
      where: {
        landlordId,
        status: 'PENDING',
        dueDate: {
          lt: today,
        },
        penaltyAmount: 0, // Only payments without penalties
      },
      include: {
        tenant: true,
        property: true,
        lease: true,
      },
    });

    const results = {
      processed: 0,
      penaltiesApplied: 0,
      totalPenaltyAmount: 0,
      errors: [] as string[],
    };

    for (const payment of overduePayments) {
      try {
        const daysOverdue = Math.ceil((today.getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysOverdue > 0) {
          let penaltyAmount = 0;

          // Apply penalty rules
          if (penaltyRules) {
            // Custom penalty rules
            if (penaltyRules.type === 'percentage') {
              penaltyAmount = payment.amount * (penaltyRules.percentage || 0.05);
            } else if (penaltyRules.type === 'fixed') {
              penaltyAmount = penaltyRules.amount || 500;
            } else if (penaltyRules.type === 'daily') {
              penaltyAmount = (penaltyRules.dailyRate || 100) * daysOverdue;
            }
          } else {
            // Default penalty calculation
            const percentagePenalty = payment.amount * 0.05;
            const dailyPenalty = 100 * daysOverdue;
            penaltyAmount = Math.max(percentagePenalty + dailyPenalty, 500);
          }

          // Update payment with penalty
          await db.payment.update({
            where: { id: payment.id },
            data: {
              penaltyAmount,
              status: daysOverdue > 7 ? 'OVERDUE' : 'PENDING',
              notes: `${payment.notes || ''}. Late penalty applied automatically. Amount: KES ${penaltyAmount}`,
            },
          });

          results.penaltiesApplied++;
          results.totalPenaltyAmount += penaltyAmount;
        }

        results.processed++;
      } catch (error) {
        console.error(`Error processing payment ${payment.id}:`, error);
        results.errors.push(`Failed to process payment ${payment.id}`);
      }
    }

    // Create summary notification
    await db.notification.create({
      data: {
        title: 'Bulk Penalties Applied',
        message: `Applied penalties to ${results.penaltiesApplied} payments. Total penalty amount: KES ${results.totalPenaltyAmount}`,
        type: 'BULK_PENALTIES',
        userId: landlordId,
      },
    });

    return NextResponse.json({
      message: 'Bulk penalty process completed',
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in bulk penalty application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}