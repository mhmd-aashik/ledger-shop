"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch analytics data
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, icon: Clock },
      PROCESSING: { variant: "default" as const, icon: Clock },
      SHIPPED: { variant: "default" as const, icon: TrendingUp },
      DELIVERED: { variant: "default" as const, icon: CheckCircle },
      CANCELLED: { variant: "destructive" as const, icon: Clock },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-2">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+12.5%", // This would be calculated from historical data
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      change: "+3.1%",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      title: "Active Customers",
      value: stats.totalCustomers.toString(),
      change: "+15.1%",
      changeType: "positive" as const,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-600 text-lg mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const gradientColors = [
            "from-blue-500 to-cyan-500",
            "from-purple-500 to-pink-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-red-500",
          ];
          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index]} opacity-5`}
              ></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-slate-700">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-xl bg-gradient-to-r ${gradientColors[index]} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.changeType === "positive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-500">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Latest orders from your customers
                </CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {order.id}
                      </p>
                      <p className="text-sm text-slate-600">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Common administrative tasks
                </CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/products"
                className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Manage Products
                </span>
              </a>
              <a
                href="/admin/orders"
                className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  View Orders
                </span>
              </a>
              <a
                href="/admin/reviews"
                className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Manage Reviews
                </span>
              </a>
              <a
                href="/admin/customers"
                className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  View Customers
                </span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

