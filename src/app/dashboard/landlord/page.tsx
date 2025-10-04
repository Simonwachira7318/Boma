'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building, 
  Users, 
  DollarSign, 
  Calendar, 
  FileText, 
  Settings, 
  Bell,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandlordDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: 'Total Properties',
      value: '12',
      change: '+2',
      icon: Building,
      color: 'text-blue-600',
    },
    {
      title: 'Active Tenants',
      value: '28',
      change: '+3',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Monthly Revenue',
      value: 'KES 485,000',
      change: '+12%',
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Pending Payments',
      value: '5',
      change: '-2',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  const recentPayments = [
    {
      id: 1,
      tenant: 'John Doe',
      property: 'Downtown Apartment',
      amount: 'KES 45,000',
      status: 'Paid',
      date: '2024-01-15',
    },
    {
      id: 2,
      tenant: 'Jane Smith',
      property: 'Westlands Studio',
      amount: 'KES 35,000',
      status: 'Pending',
      date: '2024-01-15',
    },
    {
      id: 3,
      tenant: 'Mike Johnson',
      property: 'Karen Villa',
      amount: 'KES 85,000',
      status: 'Overdue',
      date: '2024-01-10',
    },
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/landlord' },
    { icon: Building, label: 'Properties', href: '/dashboard/landlord/properties' },
    { icon: Users, label: 'Tenants', href: '/dashboard/landlord/tenants' },
    { icon: DollarSign, label: 'Payments', href: '/dashboard/landlord/payments' },
    { icon: Calendar, label: 'Leases', href: '/dashboard/landlord/leases' },
    { icon: FileText, label: 'Reports', href: '/dashboard/landlord/reports' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/landlord/notifications' },
    { icon: Settings, label: 'Settings', href: '/dashboard/landlord/settings' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 lg:translate-x-0"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <img 
              src="https://simonimageurl.netlify.app/images/boma-logo.png" 
              alt="Boma Properties Ltd" 
              className="h-8 w-auto"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    JD
                  </span>
                </div>
                <span className="hidden md:block">John Doe</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.change} from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.tenant}</p>
                            <p className="text-sm text-muted-foreground">{payment.property}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{payment.amount}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {payment.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col space-y-2">
                      <Building className="w-6 h-6" />
                      <span>Add Property</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <Users className="w-6 h-6" />
                      <span>Add Tenant</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <DollarSign className="w-6 h-6" />
                      <span>Record Payment</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2">
                      <FileText className="w-6 h-6" />
                      <span>Generate Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Property Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">10</p>
                    <p className="text-sm text-muted-foreground">Occupied</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">2</p>
                    <p className="text-sm text-muted-foreground">Vacant</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LandlordDashboard;