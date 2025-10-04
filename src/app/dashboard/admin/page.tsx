'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Building, 
  DollarSign, 
  Settings, 
  Bell,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  BarChart3,
  Shield,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: 'Total Users',
      value: '156',
      change: '+12',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Properties',
      value: '89',
      change: '+8',
      icon: Building,
      color: 'text-green-600',
    },
    {
      title: 'System Revenue',
      value: 'KES 2.4M',
      change: '+18%',
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Active Issues',
      value: '7',
      change: '-3',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Registered new account',
      role: 'Landlord',
      time: '2 minutes ago',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Added new property',
      role: 'Landlord',
      time: '15 minutes ago',
    },
    {
      id: 3,
      user: 'System',
      action: 'Payment reminder sent',
      role: 'Automated',
      time: '1 hour ago',
    },
    {
      id: 4,
      user: 'Mike Johnson',
      action: 'Reported issue',
      role: 'Landlord',
      time: '2 hours ago',
    },
  ];

  const systemHealth = [
    { name: 'Database', status: 'Healthy', value: '99.9%' },
    { name: 'API Server', status: 'Healthy', value: '99.8%' },
    { name: 'Email Service', status: 'Warning', value: '95.2%' },
    { name: 'Storage', status: 'Healthy', value: '87.3%' },
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/admin' },
    { icon: Users, label: 'User Management', href: '/dashboard/admin/users' },
    { icon: Building, label: 'Properties', href: '/dashboard/admin/properties' },
    { icon: DollarSign, label: 'Payments', href: '/dashboard/admin/payments' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/admin/analytics' },
    { icon: Shield, label: 'Security', href: '/dashboard/admin/security' },
    { icon: Activity, label: 'System Logs', href: '/dashboard/admin/logs' },
    { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'landlord':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'tenant':
        return 'bg-green-100 text-green-800';
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
            <Badge variant="secondary">Admin</Badge>
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
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    AD
                  </span>
                </div>
                <span className="hidden md:block">Admin User</span>
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
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.user}</p>
                            <p className="text-sm text-muted-foreground">{activity.action}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getRoleColor(activity.role)}>
                            {activity.role}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <CheckCircle className={`w-5 h-5 ${
                              service.status === 'Healthy' ? 'text-green-600' : 
                              service.status === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.value} uptime</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Admin Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2">
                    <UserPlus className="w-6 h-6" />
                    <span>Add User</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Shield className="w-6 h-6" />
                    <span>Security</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Settings className="w-6 h-6" />
                    <span>Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>User Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">120</p>
                    <p className="text-sm text-muted-foreground">Landlords</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">35</p>
                    <p className="text-sm text-muted-foreground">Admins</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">1</p>
                    <p className="text-sm text-muted-foreground">System Admin</p>
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

export default AdminDashboard;