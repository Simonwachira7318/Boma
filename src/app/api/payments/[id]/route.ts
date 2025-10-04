import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, paidDate, paymentMethod, transactionId, penaltyAmount, notes } = await request.json();

    // Find the payment
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        lease: true,
        tenant: true,
        property: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment
    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paidDate && { paidDate: new Date(paidDate) }),
        ...(paymentMethod && { paymentMethod }),
        ...(transactionId && { transactionId }),
        ...(penaltyAmount !== undefined && { penaltyAmount: parseFloat(penaltyAmount) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        tenant: true,
        property: true,
        lease: true,
      },
    });

    return NextResponse.json({
      message: 'Payment updated successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find the payment
    const payment = await db.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Delete payment
    await db.payment.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}