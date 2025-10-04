import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { landlordId, reportType, month, year } = await request.json();

    if (!landlordId || !reportType || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch data for the report
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get landlord information
    const landlord = await db.user.findUnique({
      where: { id: landlordId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!landlord) {
      return NextResponse.json(
        { error: 'Landlord not found' },
        { status: 404 }
      );
    }

    // Get properties for the landlord
    const properties = await db.property.findMany({
      where: { landlordId },
      include: {
        leases: {
          where: {
            OR: [
              {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
              {
                startDate: { gte: startDate, lte: endDate },
              },
            ],
          },
          include: {
            tenant: true,
            payments: {
              where: {
                dueDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        },
        payments: {
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    // Calculate statistics
    const stats = {
      totalProperties: properties.length,
      occupiedProperties: properties.filter(p => 
        p.leases.some(l => l.status === 'ACTIVE')
      ).length,
      totalRevenue: 0,
      collectedRevenue: 0,
      pendingRevenue: 0,
      totalPenalties: 0,
      collectedPenalties: 0,
      pendingPayments: 0,
      overduePayments: 0,
      activeTenants: new Set(),
      newLeases: 0,
      expiringLeases: 0,
    };

    properties.forEach(property => {
      property.leases.forEach(lease => {
        if (lease.status === 'ACTIVE') {
          stats.activeTenants.add(lease.tenantId);
          
          if (lease.startDate >= startDate && lease.startDate <= endDate) {
            stats.newLeases++;
          }
          
          if (lease.endDate >= startDate && lease.endDate <= endDate) {
            stats.expiringLeases++;
          }
        }

        lease.payments.forEach(payment => {
          stats.totalRevenue += payment.amount;
          stats.totalPenalties += payment.penaltyAmount;

          if (payment.status === 'PAID') {
            stats.collectedRevenue += payment.amount;
            stats.collectedPenalties += payment.penaltyAmount;
          } else {
            stats.pendingRevenue += payment.amount + payment.penaltyAmount;
            if (payment.status === 'PENDING') {
              stats.pendingPayments++;
            } else if (payment.status === 'OVERDUE') {
              stats.overduePayments++;
            }
          }
        });
      });
    });

    stats.activeTenants = stats.activeTenants.size;

    // Prepare data for AI analysis
    const reportData = {
      landlord: {
        name: `${landlord.firstName} ${landlord.lastName}`,
        email: landlord.email,
        phone: landlord.phone,
      },
      period: {
        month: new Date(year, month - 1).toLocaleDateString('default', { month: 'long' }),
        year: year,
      },
      statistics: stats,
      properties: properties.map(p => ({
        id: p.id,
        title: p.title,
        address: p.address,
        city: p.city,
        type: p.type,
        rentAmount: p.rentAmount,
        isAvailable: p.isAvailable,
        occupancyRate: p.leases.length > 0 ? 
          (p.leases.filter(l => l.status === 'ACTIVE').length / p.leases.length) * 100 : 0,
        monthlyRevenue: p.payments
          .filter(payment => payment.status === 'PAID')
          .reduce((sum, p) => sum + p.amount, 0),
      })),
      topPerformers: properties
        .filter(p => p.leases.some(l => l.status === 'ACTIVE'))
        .sort((a, b) => {
          const aRevenue = a.payments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + p.amount, 0);
          const bRevenue = b.payments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + p.amount, 0);
          return bRevenue - aRevenue;
        })
        .slice(0, 5),
      issues: {
        highVacancyRate: properties.filter(p => p.isAvailable).length > properties.length * 0.2,
        highOverdueRate: stats.overduePayments > stats.activeTenants * 0.1,
        lowOccupancy: stats.occupiedProperties / stats.totalProperties < 0.8,
        highPenaltyRate: stats.totalPenalties > stats.totalRevenue * 0.05,
      },
    };

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Generate AI-powered report based on type
    let aiPrompt = '';
    let reportTitle = '';

    switch (reportType) {
      case 'monthly_summary':
        reportTitle = `Monthly Summary Report - ${reportData.period.month} ${reportData.period.year}`;
        aiPrompt = `
          As a professional property management analyst, generate a comprehensive monthly summary report for ${reportData.landlord.name} for ${reportData.period.month} ${reportData.period.year}.

          Key Statistics:
          - Total Properties: ${stats.totalProperties}
          - Occupied Properties: ${stats.occupiedProperties}
          - Active Tenants: ${stats.activeTenants}
          - Total Revenue: KES ${stats.totalRevenue.toLocaleString()}
          - Collected Revenue: KES ${stats.collectedRevenue.toLocaleString()}
          - Pending Revenue: KES ${stats.pendingRevenue.toLocaleString()}
          - Total Penalties: KES ${stats.totalPenalties.toLocaleString()}
          - Pending Payments: ${stats.pendingPayments}
          - Overdue Payments: ${stats.overduePayments}
          - New Leases: ${stats.newLeases}
          - Expiring Leases: ${stats.expiringLeases}

          Top Performing Properties:
          ${reportData.topPerformers.slice(0, 3).map((p, i) => 
            `${i + 1}. ${p.title} - KES ${p.monthlyRevenue.toLocaleString()} monthly revenue`
          ).join('\n')}

          Issues Identified:
          ${Object.entries(reportData.issues)
            .filter(([_, hasIssue]) => hasIssue)
            .map(([issue, _]) => `- ${issue.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
            .join('\n')}

          Please provide:
          1. Executive Summary
          2. Financial Performance Analysis
          3. Property Performance Breakdown
          4. Tenant Management Insights
          5. Issues and Recommendations
          6. Action Items for Next Month
          7. Market Insights and Opportunities

          Format the report in a professional, easy-to-read manner with clear sections and actionable insights.
        `;
        break;

      case 'financial_analysis':
        reportTitle = `Financial Analysis Report - ${reportData.period.month} ${reportData.period.year}`;
        aiPrompt = `
          As a financial analyst specializing in real estate, provide a detailed financial analysis for ${reportData.landlord.name}'s property portfolio for ${reportData.period.month} ${reportData.period.year}.

          Financial Data:
          - Total Revenue: KES ${stats.totalRevenue.toLocaleString()}
          - Collected Revenue: KES ${stats.collectedRevenue.toLocaleString()}
          - Collection Rate: ${((stats.collectedRevenue / stats.totalRevenue) * 100).toFixed(1)}%
          - Pending Revenue: KES ${stats.pendingRevenue.toLocaleString()}
          - Total Penalties: KES ${stats.totalPenalties.toLocaleString()}
          - Penalty Rate: ${((stats.totalPenalties / stats.totalRevenue) * 100).toFixed(2)}%
          - Average Revenue per Property: KES ${(stats.totalRevenue / stats.totalProperties).toLocaleString()}
          - Occupancy Rate: ${((stats.occupiedProperties / stats.totalProperties) * 100).toFixed(1)}%

          Property Breakdown:
          ${reportData.properties.map(p => `
          ${p.title}: 
          - Type: ${p.type}
          - Monthly Rent: KES ${p.rentAmount.toLocaleString()}
          - Monthly Revenue: KES ${p.monthlyRevenue.toLocaleString()}
          - Occupancy: ${p.isAvailable ? 'Vacant' : 'Occupied'}
          - Occupancy Rate: ${p.occupancyRate.toFixed(1)}%
          `).join('\n')}

          Please provide:
          1. Revenue Analysis and Trends
          2. Collection Efficiency Analysis
          3. Property-by-Property Financial Performance
          4. Penalty Analysis and Impact
          5. Cash Flow Analysis
          6. Financial Health Assessment
          7. Recommendations for Financial Optimization
          8. Benchmarking Against Industry Standards

          Include specific metrics, percentages, and actionable financial recommendations.
        `;
        break;

      case 'operational_insights':
        reportTitle = `Operational Insights Report - ${reportData.period.month} ${reportData.period.year}`;
        aiPrompt = `
          As a property management operations expert, analyze the operational performance of ${reportData.landlord.name}'s property portfolio for ${reportData.period.month} ${reportData.period.year}.

          Operational Metrics:
          - Total Properties: ${stats.totalProperties}
          - Occupied Properties: ${stats.occupiedProperties}
          - Vacant Properties: ${stats.totalProperties - stats.occupiedProperties}
          - Occupancy Rate: ${((stats.occupiedProperties / stats.totalProperties) * 100).toFixed(1)}%
          - Active Tenants: ${stats.activeTenants}
          - New Leases Signed: ${stats.newLeases}
          - Leases Expiring: ${stats.expiringLeases}
          - Pending Payments: ${stats.pendingPayments}
          - Overdue Payments: ${stats.overduePayments}
          - Payment Issues: ${((stats.pendingPayments + stats.overduePayments) / stats.activeTenants * 100).toFixed(1)}%

          Property Portfolio:
          ${reportData.properties.map(p => `
          ${p.title} (${p.type}):
          - Address: ${p.address}, ${p.city}
          - Status: ${p.isAvailable ? 'Vacant' : 'Occupied'}
          - Monthly Rent: KES ${p.rentAmount.toLocaleString()}
          - Active Leases: ${p.leases.filter(l => l.status === 'ACTIVE').length}
          `).join('\n')}

          Operational Challenges:
          ${Object.entries(reportData.issues)
            .filter(([_, hasIssue]) => hasIssue)
            .map(([issue, _]) => `- ${issue.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
            .join('\n')}

          Please provide:
          1. Operational Performance Overview
          2. Portfolio Analysis and Optimization
          3. Tenant Management and Retention Strategies
          4. Vacancy Management Recommendations
          5. Lease Management Insights
          6. Payment Collection Optimization
          7. Operational Efficiency Improvements
          8. Technology and Process Recommendations
          9. Risk Assessment and Mitigation
          10. Action Plan for Operational Excellence

          Focus on practical, actionable insights that can improve operational efficiency and tenant satisfaction.
        `;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }

    // Generate AI report
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert property management consultant and analyst with deep knowledge of real estate operations, financial analysis, and tenant management. Provide detailed, actionable insights and recommendations in a professional format.',
        },
        {
          role: 'user',
          content: aiPrompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    });

    const aiReport = completion.choices[0]?.message?.content || 'Unable to generate report';

    // Save report to database (optional)
    const savedReport = await db.notification.create({
      data: {
        title: reportTitle,
        message: `AI-generated ${reportType} report for ${reportData.period.month} ${reportData.period.year}`,
        type: 'AI_REPORT',
        userId: landlordId,
      },
    });

    return NextResponse.json({
      message: 'Report generated successfully',
      report: {
        id: savedReport.id,
        title: reportTitle,
        type: reportType,
        period: { month, year },
        generatedAt: new Date().toISOString(),
        content: aiReport,
        data: reportData,
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}