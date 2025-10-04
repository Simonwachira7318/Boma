import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.MAIL_SERVER,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // use TLS
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const { type, paymentId, customMessage } = await request.json();

    if (!type || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch payment details with tenant and property information
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        tenant: true,
        property: true,
        lease: true,
        landlord: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const transporter = createTransporter();
    
    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'PAYMENT_REMINDER':
        subject = `Rent Payment Reminder - ${payment.property.title}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #bf924a; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Boma Properties Ltd</h1>
            </div>
            <div style="padding: 20px; background: #fefdfb;">
              <h2 style="color: #120e08;">Rent Payment Reminder</h2>
              <p>Dear ${payment.tenant.firstName} ${payment.tenant.lastName},</p>
              <p>This is a friendly reminder that your rent payment for <strong>${payment.property.title}</strong> is due on <strong>${new Date(payment.dueDate).toLocaleDateString()}</strong>.</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Payment Details:</strong></p>
                <p>Amount: KES ${payment.amount.toLocaleString()}</p>
                <p>Due Date: ${new Date(payment.dueDate).toLocaleDateString()}</p>
                <p>Property: ${payment.property.title}</p>
                <p>Address: ${payment.property.address}, ${payment.property.city}</p>
              </div>
              ${customMessage ? `<p><strong>Additional Message:</strong> ${customMessage}</p>` : ''}
              <p>Please make your payment on time to avoid any late fees. If you have already made the payment, please disregard this notice.</p>
              <p>For any questions or concerns, please contact your landlord or our support team.</p>
              <p>Thank you,<br>Boma Properties Ltd Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
              <p>&copy; 2024 Boma Properties Ltd. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `;
        break;

      case 'OVERDUE_NOTICE':
        subject = `Overdue Rent Payment - ${payment.property.title}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Boma Properties Ltd</h1>
            </div>
            <div style="padding: 20px; background: #fefdfb;">
              <h2 style="color: #dc3545;">Overdue Rent Payment Notice</h2>
              <p>Dear ${payment.tenant.firstName} ${payment.tenant.lastName},</p>
              <p>This notice is to inform you that your rent payment for <strong>${payment.property.title}</strong> is overdue.</p>
              <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
                <p><strong>Overdue Payment Details:</strong></p>
                <p>Original Amount: KES ${payment.amount.toLocaleString()}</p>
                <p>Due Date: ${new Date(payment.dueDate).toLocaleDateString()}</p>
                <p>Days Overdue: ${Math.ceil((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
                ${payment.penaltyAmount > 0 ? `<p>Late Penalty: KES ${payment.penaltyAmount.toLocaleString()}</p>` : ''}
                <p><strong>Total Amount Due: KES ${(payment.amount + payment.penaltyAmount).toLocaleString()}</strong></p>
              </div>
              <p>Please arrange for payment immediately to avoid further penalties and potential legal action.</p>
              ${customMessage ? `<p><strong>Additional Message:</strong> ${customMessage}</p>` : ''}
              <p>If you are experiencing financial difficulties, please contact your landlord to discuss payment arrangements.</p>
              <p>Thank you,<br>Boma Properties Ltd Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
              <p>&copy; 2024 Boma Properties Ltd. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `;
        break;

      case 'PAYMENT_CONFIRMATION':
        subject = `Payment Confirmation - ${payment.property.title}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Boma Properties Ltd</h1>
            </div>
            <div style="padding: 20px; background: #fefdfb;">
              <h2 style="color: #28a745;">Payment Confirmation</h2>
              <p>Dear ${payment.tenant.firstName} ${payment.tenant.lastName},</p>
              <p>We are pleased to confirm that we have received your rent payment for <strong>${payment.property.title}</strong>.</p>
              <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #28a745;">
                <p><strong>Payment Confirmation Details:</strong></p>
                <p>Amount Paid: KES ${payment.amount.toLocaleString()}</p>
                <p>Payment Date: ${new Date(payment.paidDate!).toLocaleDateString()}</p>
                <p>Payment Method: ${payment.paymentMethod || 'Not specified'}</p>
                ${payment.transactionId ? `<p>Transaction ID: ${payment.transactionId}</p>` : ''}
                <p>Property: ${payment.property.title}</p>
              </div>
              <p>Thank you for your prompt payment. Your payment has been successfully processed and applied to your account.</p>
              ${customMessage ? `<p><strong>Additional Message:</strong> ${customMessage}</p>` : ''}
              <p>Please keep this email for your records.</p>
              <p>Thank you,<br>Boma Properties Ltd Team</p>
            </div>
            <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
              <p>&copy; 2024 Boma Properties Ltd. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        `;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    const mailOptions = {
      from: process.env.MAIL_DEFAULT_SENDER,
      to: payment.tenant.email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    // Log the email sent
    await db.notification.create({
      data: {
        title: `Email Sent: ${subject}`,
        message: `${type} email sent to ${payment.tenant.email}`,
        type: 'EMAIL_SENT',
        userId: payment.landlordId,
      },
    });

    return NextResponse.json({
      message: 'Email sent successfully',
      emailType: type,
      recipient: payment.tenant.email,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Endpoint to send bulk reminders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get('landlordId');
    const type = searchParams.get('type'); // 'upcoming' or 'overdue'

    if (!landlordId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const today = new Date();
    const upcomingDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    let payments = [];

    if (type === 'upcoming') {
      // Get payments due in the next 3 days that are still pending
      payments = await db.payment.findMany({
        where: {
          landlordId,
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
    } else if (type === 'overdue') {
      // Get overdue payments
      payments = await db.payment.findMany({
        where: {
          landlordId,
          status: 'PENDING',
          dueDate: {
            lt: today,
          },
        },
        include: {
          tenant: true,
          property: true,
          landlord: true,
        },
      });
    }

    const transporter = createTransporter();
    const results = [];

    for (const payment of payments) {
      try {
        const emailType = type === 'upcoming' ? 'PAYMENT_REMINDER' : 'OVERDUE_NOTICE';
        const subject = type === 'upcoming' 
          ? `Rent Payment Reminder - ${payment.property.title}`
          : `Overdue Rent Payment - ${payment.property.title}`;

        const mailOptions = {
          from: process.env.MAIL_DEFAULT_SENDER,
          to: payment.tenant.email,
          subject,
          html: generateEmailContent(emailType, payment),
        };

        await transporter.sendMail(mailOptions);

        // Log the email sent
        await db.notification.create({
          data: {
            title: `Bulk Email Sent: ${subject}`,
            message: `${emailType} email sent to ${payment.tenant.email}`,
            type: 'BULK_EMAIL_SENT',
            userId: payment.landlordId,
          },
        });

        results.push({
          paymentId: payment.id,
          tenantEmail: payment.tenant.email,
          status: 'sent',
        });
      } catch (error) {
        console.error(`Error sending email to ${payment.tenant.email}:`, error);
        results.push({
          paymentId: payment.id,
          tenantEmail: payment.tenant.email,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: `Bulk email process completed for ${type} payments`,
      results,
      totalProcessed: payments.length,
      successful: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
    });

  } catch (error) {
    console.error('Error in bulk email process:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk emails' },
      { status: 500 }
    );
  }
}

function generateEmailContent(type: string, payment: any) {
  // Helper function to generate email content (similar to POST function)
  if (type === 'PAYMENT_REMINDER') {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #bf924a; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Boma Properties Ltd</h1>
        </div>
        <div style="padding: 20px; background: #fefdfb;">
          <h2 style="color: #120e08;">Automated Rent Payment Reminder</h2>
          <p>Dear ${payment.tenant.firstName} ${payment.tenant.lastName},</p>
          <p>This is an automated reminder that your rent payment for <strong>${payment.property.title}</strong> is due on <strong>${new Date(payment.dueDate).toLocaleDateString()}</strong>.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Payment Details:</strong></p>
            <p>Amount: KES ${payment.amount.toLocaleString()}</p>
            <p>Due Date: ${new Date(payment.dueDate).toLocaleDateString()}</p>
            <p>Property: ${payment.property.title}</p>
          </div>
          <p>Please make your payment on time to avoid any late fees.</p>
          <p>Thank you,<br>Boma Properties Ltd Team</p>
        </div>
      </div>
    `;
  } else {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Boma Properties Ltd</h1>
        </div>
        <div style="padding: 20px; background: #fefdfb;">
          <h2 style="color: #dc3545;">Automated Overdue Rent Payment Notice</h2>
          <p>Dear ${payment.tenant.firstName} ${payment.tenant.lastName},</p>
          <p>This is an automated notice that your rent payment for <strong>${payment.property.title}</strong> is overdue.</p>
          <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #dc3545;">
            <p><strong>Overdue Payment Details:</strong></p>
            <p>Amount: KES ${payment.amount.toLocaleString()}</p>
            <p>Due Date: ${new Date(payment.dueDate).toLocaleDateString()}</p>
          </div>
          <p>Please arrange for payment immediately.</p>
          <p>Thank you,<br>Boma Properties Ltd Team</p>
        </div>
      </div>
    `;
  }
}