import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security check - in production, use proper authentication
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const today = new Date();
    const results = {
      upcomingReminders: 0,
      overdueNotices: 0,
      penaltiesApplied: 0,
      errors: [] as string[],
    };

    try {
      // 1. Send reminders for upcoming payments (due in next 3 days)
      const upcomingDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      const upcomingPayments = await db.payment.findMany({
        where: {
          status: 'PENDING',
          dueDate: {
            gte: today,
            lte: upcomingDate,
          },
        },
        include: {
          tenant: true,
          property: true,
          landlord: true,
        },
      });

      // Send email reminders for upcoming payments
      for (const payment of upcomingPayments) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'PAYMENT_REMINDER',
              paymentId: payment.id,
              customMessage: 'This is an automated reminder. Your payment is due in 3 days.',
            }),
          });
          results.upcomingReminders++;
        } catch (error) {
          console.error(`Error sending reminder for payment ${payment.id}:`, error);
          results.errors.push(`Failed to send reminder for payment ${payment.id}`);
        }
      }

      // 2. Send overdue notices and apply penalties
      const overduePayments = await db.payment.findMany({
        where: {
          status: 'PENDING',
          dueDate: {
            lt: today,
          },
        },
        include: {
          tenant: true,
          property: true,
          landlord: true,
          lease: true,
        },
      });

      for (const payment of overduePayments) {
        try {
          // Send overdue notice
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'OVERDUE_NOTICE',
              paymentId: payment.id,
              customMessage: 'This is an automated overdue notice. Please pay immediately to avoid further penalties.',
            }),
          });
          results.overdueNotices++;

          // Apply late penalty (5% of rent amount, minimum KES 500)
          const daysOverdue = Math.ceil((today.getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24));
          if (daysOverdue > 0) {
            const penaltyAmount = Math.max(payment.amount * 0.05, 500);
            
            await db.payment.update({
              where: { id: payment.id },
              data: {
                penaltyAmount: penaltyAmount,
                status: daysOverdue > 7 ? 'OVERDUE' : 'PENDING', // Mark as overdue if more than 7 days
              },
            });
            results.penaltiesApplied++;
          }
        } catch (error) {
          console.error(`Error processing overdue payment ${payment.id}:`, error);
          results.errors.push(`Failed to process overdue payment ${payment.id}`);
        }
      }

      // 3. Check for lease expirations (30 days before expiry)
      const leaseExpiryDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const expiringLeases = await db.lease.findMany({
        where: {
          status: 'ACTIVE',
          endDate: {
            gte: today,
            lte: leaseExpiryDate,
          },
        },
        include: {
          tenant: true,
          property: true,
          landlord: true,
        },
      });

      // Send lease renewal reminders
      for (const lease of expiringLeases) {
        try {
          // Create notification for landlord
          await db.notification.create({
            data: {
              title: 'Lease Expiring Soon',
              message: `Lease for ${lease.property.title} occupied by ${lease.tenant.firstName} ${lease.tenant.lastName} is expiring on ${new Date(lease.endDate).toLocaleDateString()}`,
              type: 'LEASE_EXPIRY',
              userId: lease.landlordId,
            },
          });

          // Send email notification to landlord
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'PAYMENT_REMINDER', // Reuse this template
              paymentId: lease.payments[0]?.id || 'dummy', // Need a payment ID, use first or dummy
              customMessage: `Lease for ${lease.property.title} is expiring on ${new Date(lease.endDate).toLocaleDateString()}. Please contact your tenant for renewal.`,
            }),
          });
        } catch (error) {
          console.error(`Error sending lease expiry notification for lease ${lease.id}:`, error);
          results.errors.push(`Failed to send lease expiry notification for lease ${lease.id}`);
        }
      }

      // Log the cron job execution
      await db.notification.create({
        data: {
          title: 'Cron Job Executed',
          message: `Automated tasks completed: ${results.upcomingReminders} reminders, ${results.overdueNotices} overdue notices, ${results.penaltiesApplied} penalties applied`,
          type: 'CRON_JOB',
          userId: 'system', // System user
        },
      });

      return NextResponse.json({
        message: 'Cron job completed successfully',
        results,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error in cron job execution:', error);
      return NextResponse.json(
        { error: 'Cron job failed', details: error.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}