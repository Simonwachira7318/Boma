import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get('landlordId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!landlordId) {
      return NextResponse.json(
        { error: 'Landlord ID is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const where: any = {
      landlordId,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          tenant: true,
          property: true,
          lease: true,
        },
        orderBy: {
          dueDate: 'desc',
        },
        skip,
        take: limit,
      }),
      db.payment.count({ where }),
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      dueDate,
      leaseId,
      tenantId,
      landlordId,
      propertyId,
      paymentMethod,
      notes,
    } = await request.json();

    if (!amount || !dueDate || !leaseId || !tenantId || !landlordId || !propertyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if lease exists and belongs to the landlord
    const lease = await db.lease.findFirst({
      where: {
        id: leaseId,
        landlordId,
        tenantId,
        propertyId,
      },
    });

    if (!lease) {
      return NextResponse.json(
        { error: 'Invalid lease or unauthorized access' },
        { status: 403 }
      );
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        leaseId,
        tenantId,
        landlordId,
        propertyId,
        paymentMethod,
        notes,
        status: 'PENDING',
      },
      include: {
        tenant: true,
        property: true,
        lease: true,
      },
    });

    return NextResponse.json({
      message: 'Payment recorded successfully',
      payment,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}