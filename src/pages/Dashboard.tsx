import { useState, useEffect } from "react";
import { Plus, Car, Package, Wrench, Users, DollarSign, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CarManagement } from "@/components/admin/CarManagement";
import { MerchandiseManagement } from "@/components/admin/MerchandiseManagement";
import { ServiceManagement } from "@/components/admin/ServiceManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";

interface DashboardStats {
  totalCars: number;
  totalMerchandise: number;
  totalServices: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalMerchandise: 0,
    totalServices: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (user && profile?.role === 'showroom') {
      fetchStats().finally(() => {
        if (mounted) setLoading(false);
      });
    } else if (profile?.role !== 'showroom') {
      setLoading(false);
    }
    return () => { mounted = false; };
  }, [user, profile?.role]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch cars count
      const { count: carsCount } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('admin_id', user.id);

      // Fetch merchandise count
      const { count: merchandiseCount } = await supabase
        .from('merchandise')
        .select('*', { count: 'exact', head: true })
        .eq('admin_id', user.id);

      // Fetch services count
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('admin_id', user.id);

      // Fetch orders
      const { data: orders, count: ordersCount } = await supabase
        .from('orders')
        .select('total_amount, created_at', { count: 'exact' });

      // Calculate revenue
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }).reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalCars: carsCount || 0,
        totalMerchandise: merchandiseCount || 0,
        totalServices: servicesCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'showroom') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You need showroom access to view this page.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Showroom Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your inventory and track your business
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All time earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                This month's earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Customer orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cars Listed</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-muted-foreground">
                Active listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Merchandise</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMerchandise}</div>
              <p className="text-xs text-muted-foreground">
                Products available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">
                Services offered
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="cars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Cars
            </TabsTrigger>
            <TabsTrigger value="merchandise" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Merchandise
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cars">
            <CarManagement onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="merchandise">
            <MerchandiseManagement onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="services">
            <ServiceManagement onUpdate={fetchStats} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="clients">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Client Management</h3>
              <p className="text-muted-foreground">Manage all users who have placed orders with your showroom.</p>
              {/* Clients component would go here */}
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Clients management coming soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Team Management</h3>
              <p className="text-muted-foreground">Manage team members and assign roles within your showroom.</p>
              {/* Team component would go here */}
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Team management coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;