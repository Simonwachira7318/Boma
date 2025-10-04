'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  Users, 
  Search,
  Filter,
  Download,
  Plus,
  Settings,
  RefreshCw,
  Ban,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';

interface Penalty {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  penaltyAmount: number;
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  property: {
    id: string;
    title: string;
    address: string;
  };
  lease: {
    id: string;
    monthlyRent: number;
  };
}

const PenaltiesPage = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [penaltyRules, setPenaltyRules] = useState({
    type: 'percentage',
    percentage: 5,
    amount: 500,
    dailyRate: 100,
    autoApply: true,
  });

  // Mock data for demo
  useEffect(() => {
    setTimeout(() => {
      setPenalties([
        {
          id: '1',
          amount: 45000,
          dueDate: '2024-01-10',
          status: 'OVERDUE',
          penaltyAmount: 2500,
          tenant: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          property: {
            id: '1',
            title: 'Downtown Apartment',
            address: 'Nairobi, Kenya',
          },
          lease: {
            id: '1',
            monthlyRent: 45000,
          },
        },
        {
          id: '2',
          amount: 35000,
          dueDate: '2024-01-08',
          status: 'OVERDUE',
          penaltyAmount: 1750,
          tenant: {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
          },
          property: {
            id: '2',
            title: 'Westlands Studio',
            address: 'Nairobi, Kenya',
          },
          lease: {
            id: '2',
            monthlyRent: 35000,
          },
        },
        {
          id: '3',
          amount: 85000,
          dueDate: '2024-01-05',
          status: 'PAID',
          penaltyAmount: 4250,
          paidDate: '2024-01-12',
          tenant: {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike@example.com',
          },
          property: {
            id: '3',
            title: 'Karen Villa',
            address: 'Karen, Kenya',
          },
          lease: {
            id: '3',
            monthlyRent: 85000,
          },
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'PARTIAL':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPenalties = penalties.filter((penalty) => {
    const matchesSearch = 
      penalty.tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      penalty.tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      penalty.property.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || penalty.status === statusFilter;
    
    return matchesSearch && matchesStatus && penalty.penaltyAmount > 0;
  });

  const totalPenalties = penalties.reduce((sum, p) => sum + p.penaltyAmount, 0);
  const paidPenalties = penalties
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);
  const pendingPenalties = penalties
    .filter(p => p.status === 'PENDING' || p.status === 'OVERDUE')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);

  const handleBulkApply = () => {
    // Simulate bulk penalty application
    alert('Bulk penalties would be applied to all overdue payments without penalties.');
    setIsBulkDialogOpen(false);
  };

  const handleWaivePenalty = (penaltyId: string) => {
    setPenalties(penalties.map(p => 
      p.id === penaltyId 
        ? { ...p, penaltyAmount: 0, notes: `${p.notes || ''}. Penalty waived.` }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold">Late Payment Penalties</h1>
            <p className="text-muted-foreground">Manage and track late payment penalties</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Bulk Apply
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Bulk Apply Penalties</DialogTitle>
                  <DialogDescription>
                    Apply late payment penalties to all overdue payments that don't have penalties yet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="penaltyType" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={penaltyRules.type} 
                      onValueChange={(value) => setPenaltyRules({...penaltyRules, type: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="daily">Daily Rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {penaltyRules.type === 'percentage' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="percentage" className="text-right">
                        Percentage
                      </Label>
                      <Input
                        id="percentage"
                        type="number"
                        value={penaltyRules.percentage}
                        onChange={(e) => setPenaltyRules({...penaltyRules, percentage: parseFloat(e.target.value) || 0})}
                        className="col-span-3"
                      />
                    </div>
                  )}
                  
                  {penaltyRules.type === 'fixed' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fixedAmount" className="text-right">
                        Amount (KES)
                      </Label>
                      <Input
                        id="fixedAmount"
                        type="number"
                        value={penaltyRules.amount}
                        onChange={(e) => setPenaltyRules({...penaltyRules, amount: parseFloat(e.target.value) || 0})}
                        className="col-span-3"
                      />
                    </div>
                  )}
                  
                  {penaltyRules.type === 'daily' && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dailyRate" className="text-right">
                        Daily Rate (KES)
                      </Label>
                      <Input
                        id="dailyRate"
                        type="number"
                        value={penaltyRules.dailyRate}
                        onChange={(e) => setPenaltyRules({...penaltyRules, dailyRate: parseFloat(e.target.value) || 0})}
                        className="col-span-3"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="autoApply" className="text-right">
                      Auto Apply
                    </Label>
                    <Switch
                      id="autoApply"
                      checked={penaltyRules.autoApply}
                      onCheckedChange={(checked) => setPenaltyRules({...penaltyRules, autoApply: checked})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleBulkApply}>
                    Apply to All Overdue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalPenalties.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {penalties.length} payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Penalties</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {paidPenalties.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Collected penalties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Penalties</CardTitle>
              <Calendar className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {pendingPenalties.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Penalty Rules */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Penalty Rules Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Default Rate</span>
                  <Badge>5%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Percentage of rent amount</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Daily Late Fee</span>
                  <Badge>KES 100</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Per day overdue</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Minimum Penalty</span>
                  <Badge>KES 500</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Minimum penalty amount</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Auto Apply</span>
                  <Switch checked={penaltyRules.autoApply} />
                </div>
                <p className="text-xs text-muted-foreground">Automatic penalty application</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search penalties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Penalties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Penalty Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPenalties.map((penalty) => (
                  <motion.div
                    key={penalty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">
                            {penalty.tenant.firstName} {penalty.tenant.lastName}
                          </h3>
                          <Badge className={getStatusColor(penalty.status)}>
                            {penalty.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {penalty.property.title}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Due: {new Date(penalty.dueDate).toLocaleDateString()}</span>
                          {penalty.paidDate && (
                            <span>Paid: {new Date(penalty.paidDate).toLocaleDateString()}</span>
                          )}
                          <span className="text-red-600 font-medium">
                            Penalty: KES {penalty.penaltyAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">KES {(penalty.amount + penalty.penaltyAmount).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Rent: KES {penalty.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {penalty.penaltyAmount > 0 && penalty.status !== 'PAID' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWaivePenalty(penalty.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Waive
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PenaltiesPage;