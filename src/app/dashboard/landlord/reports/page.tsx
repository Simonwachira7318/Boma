'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Brain,
  RefreshCw,
  Eye,
  Filter,
  BarChart3,
  DollarSign,
  Users,
  Building,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Report {
  id: string;
  title: string;
  type: string;
  period: { month: number; year: number };
  generatedAt: string;
  content: string;
  data: any;
}

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    reportType: 'monthly_summary',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Mock data for demo
  useEffect(() => {
    setReports([
      {
        id: '1',
        title: 'Monthly Summary Report - January 2024',
        type: 'monthly_summary',
        period: { month: 1, year: 2024 },
        generatedAt: '2024-01-31T10:00:00Z',
        content: 'Executive Summary:\n\nJanuary 2024 showed strong performance across your property portfolio with an occupancy rate of 92% and revenue collection of 95%. Total revenue reached KES 485,000 with minimal penalties applied.',
        data: {
          statistics: {
            totalRevenue: 485000,
            collectedRevenue: 460750,
            occupancyRate: 92,
          },
        },
      },
      {
        id: '2',
        title: 'Financial Analysis Report - December 2023',
        type: 'financial_analysis',
        period: { month: 12, year: 2023 },
        generatedAt: '2023-12-31T10:00:00Z',
        content: 'Financial Performance Analysis:\n\nDecember 2023 demonstrated excellent financial health with a collection rate of 97%. The portfolio generated KES 520,000 in revenue with strong cash flow positive performance.',
        data: {
          statistics: {
            totalRevenue: 520000,
            collectedRevenue: 504400,
            collectionRate: 97,
          },
        },
      },
    ]);
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newReport: Report = {
          id: Date.now().toString(),
          title: `${generateForm.reportType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report - ${new Date(generateForm.year, generateForm.month - 1).toLocaleDateString('default', { month: 'long' })} ${generateForm.year}`,
          type: generateForm.reportType,
          period: { month: generateForm.month, year: generateForm.year },
          generatedAt: new Date().toISOString(),
          content: 'AI-generated report content would appear here. This is a sophisticated analysis powered by Gemini 2.5 Flash AI model.',
          data: {
            statistics: {
              totalRevenue: Math.floor(Math.random() * 500000) + 300000,
              collectedRevenue: Math.floor(Math.random() * 450000) + 280000,
              occupancyRate: Math.floor(Math.random() * 20) + 80,
            },
          },
        };
        
        setReports([newReport, ...reports]);
        setIsGenerateDialogOpen(false);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating report:', error);
      setLoading(false);
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'monthly_summary':
        return 'bg-blue-100 text-blue-800';
      case 'financial_analysis':
        return 'bg-green-100 text-green-800';
      case 'operational_insights':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'monthly_summary':
        return <BarChart3 className="w-5 h-5" />;
      case 'financial_analysis':
        return <DollarSign className="w-5 h-5" />;
      case 'operational_insights':
        return <Users className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const reportTypes = [
    { value: 'monthly_summary', label: 'Monthly Summary', description: 'Comprehensive overview of monthly performance' },
    { value: 'financial_analysis', label: 'Financial Analysis', description: 'Detailed financial performance and metrics' },
    { value: 'operational_insights', label: 'Operational Insights', description: 'Operational efficiency and recommendations' },
  ];

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold">AI-Powered Reports</h1>
            <p className="text-muted-foreground">Generate intelligent insights with Gemini 2.5 Flash AI</p>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Generate AI Report
                </DialogTitle>
                <DialogDescription>
                  Create a comprehensive report powered by Gemini 2.5 Flash AI based on your property data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reportType" className="text-right">
                    Report Type
                  </Label>
                  <Select 
                    value={generateForm.reportType} 
                    onValueChange={(value) => setGenerateForm({...generateForm, reportType: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="month" className="text-right">
                    Month
                  </Label>
                  <Select 
                    value={generateForm.month.toString()} 
                    onValueChange={(value) => setGenerateForm({...generateForm, month: parseInt(value)})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <Select 
                    value={generateForm.year.toString()} 
                    onValueChange={(value) => setGenerateForm({...generateForm, year: parseInt(value)})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{reportTypes.find(t => t.value === generateForm.reportType)?.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {reportTypes.find(t => t.value === generateForm.reportType)?.description}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleGenerateReport}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Features Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI-Powered Insights</CardTitle>
              <Brain className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gemini 2.5 Flash</div>
              <p className="text-xs text-muted-foreground">
                Advanced AI analysis for intelligent reporting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                Total AI reports created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50+</div>
              <p className="text-xs text-muted-foreground">
                Metrics analyzed per report
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Available AI Report Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reportTypes.map((type) => (
                <div key={type.value} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    {getReportTypeIcon(type.value)}
                    <h3 className="font-medium">{type.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Generated Reports
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getReportTypeIcon(report.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{report.title}</h3>
                        <Badge className={getReportTypeColor(report.type)}>
                          {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generated on {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                      {report.data.statistics && (
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>Revenue: KES {report.data.statistics.totalRevenue?.toLocaleString()}</span>
                          <span>Collection: {report.data.statistics.collectionRate || report.data.statistics.occupancyRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report View Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedReport && getReportTypeIcon(selectedReport.type)}
                <span className="ml-2">{selectedReport?.title}</span>
              </DialogTitle>
              <DialogDescription>
                AI-generated report powered by Gemini 2.5 Flash
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      KES {selectedReport.data.statistics.totalRevenue?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      KES {selectedReport.data.statistics.collectedRevenue?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedReport.data.statistics.occupancyRate || selectedReport.data.statistics.collectionRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {new Date(selectedReport.generatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Generated</div>
                  </div>
                </div>
                
                <div className="p-4 bg-card border border-border rounded-lg">
                  <h4 className="font-medium mb-3">AI Analysis</h4>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {selectedReport.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ReportsPage;