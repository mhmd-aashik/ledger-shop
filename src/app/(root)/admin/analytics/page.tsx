"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    averageOrderValue: number;
    conversionRate: number;
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
  };
  topProducts: Array<{
    rank: number;
    id: string;
    name: string;
    revenue: number;
    sales: number;
    orders: number;
    thumbnail?: string;
  }>;
  recentActivity: Array<{
    type: string;
    message: string;
    time: string;
    amount?: number;
    status?: string;
  }>;
  orderStatusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  customerGrowth: Array<{
    month: string;
    new_customers: number;
  }>;
  productPerformance: Array<{
    id: string;
    name: string;
    price: number;
    thumbnail?: string;
    totalSales: number;
    totalRevenue: number;
    favorites: number;
    reviews: number;
    orders: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [exporting, setExporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isFetchingRef = useRef(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isFetchingRef.current) {
      console.log("Already fetching analytics, skipping...");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        console.log("Fetching analytics for period:", period);
        const response = await fetch(`/api/analytics?period=${period}`);

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
          console.log("Analytics data loaded successfully");
        } else {
          const errorData = await response.json();
          console.error("Analytics API error:", errorData);
          setAnalytics(null);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setAnalytics(null);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchAnalytics();
  }, [period, mounted]);

  const refreshAnalytics = async () => {
    if (isFetchingRef.current) {
      console.log("Already fetching analytics, skipping...");
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      console.log("Refreshing analytics for period:", period);
      const response = await fetch(`/api/analytics?period=${period}`);

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        console.log("Analytics data refreshed successfully");
      } else {
        const errorData = await response.json();
        console.error("Analytics API error:", errorData);
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Failed to refresh analytics:", error);
      setAnalytics(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      setExporting(true);
      const response = await fetch(
        `/api/analytics/export?format=${format}&period=${period}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="space-y-6" suppressHydrationWarning>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Failed to load analytics data</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">This could be due to:</p>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              <li>No orders found in the database</li>
              <li>No products or customers data</li>
              <li>Authentication issues</li>
              <li>Database connection problems</li>
            </ul>
            <button
              onClick={refreshAnalytics}
              className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where analytics data exists but might be empty
  if (
    analytics.overview.totalOrders === 0 &&
    analytics.overview.totalRevenue === 0
  ) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Track your store&apos;s performance and insights
            </p>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                📊 No orders found yet. Analytics will populate once customers
                start placing orders.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button
              onClick={refreshAnalytics}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Show basic stats even with no orders */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">$0</div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400">No data available</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400">No data available</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.overview.totalCustomers}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400">Registered users</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.overview.totalProducts}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-gray-400">Available products</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${analytics.overview.totalRevenue.toLocaleString()}`,
      change: `${analytics.overview.revenueChange >= 0 ? "+" : ""}${analytics.overview.revenueChange}%`,
      changeType:
        analytics.overview.revenueChange >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: analytics.overview.totalOrders.toLocaleString(),
      change: `${analytics.overview.ordersChange >= 0 ? "+" : ""}${analytics.overview.ordersChange}%`,
      changeType:
        analytics.overview.ordersChange >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: ShoppingCart,
    },
    {
      title: "Active Customers",
      value: analytics.overview.totalCustomers.toLocaleString(),
      change: `${analytics.overview.customersChange >= 0 ? "+" : ""}${analytics.overview.customersChange}%`,
      changeType:
        analytics.overview.customersChange >= 0
          ? ("positive" as const)
          : ("negative" as const),
      icon: Users,
    },
    {
      title: "Average Order Value",
      value: `$${Number(analytics.overview.averageOrderValue).toFixed(2)}`,
      change: "+5.4%", // This would need to be calculated from historical data
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  // Format data for charts
  const revenueChartData = analytics.revenueByMonth.map((item) => ({
    month: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    revenue: Number(item.revenue),
  }));

  const customerGrowthData = analytics.customerGrowth.map((item) => ({
    month: new Date(item.month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    customers: item.new_customers,
  }));

  const orderStatusData = analytics.orderStatusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your store&apos;s performance and insights
          </p>
          {analytics.overview.totalOrders === 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                📊 No orders found yet. Analytics will populate once customers
                start placing orders.
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={refreshAnalytics}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport("csv")}
              disabled={exporting}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport("json")}
              disabled={exporting}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best performing products this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                      {product.rank}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.sales} sales • {product.orders} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ${product.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Customer Growth Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="customers" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case "order":
                    return ShoppingCart;
                  case "review":
                    return Star;
                  case "customer":
                    return Users;
                  case "product":
                    return Package;
                  default:
                    return ShoppingCart;
                }
              };
              const Icon = getIcon(activity.type);
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.amount && (
                      <p className="text-xs text-green-600 font-medium">
                        ${Number(activity.amount).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Product Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>
            Detailed performance metrics for all products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Sales</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Orders</th>
                  <th className="text-right py-2">Favorites</th>
                  <th className="text-right py-2">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {analytics.productPerformance.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">
                      <div className="flex items-center space-x-3">
                        {product.thumbnail && (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-2">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="text-right py-2">{product.totalSales}</td>
                    <td className="text-right py-2">
                      ${Number(product.totalRevenue).toFixed(2)}
                    </td>
                    <td className="text-right py-2">{product.orders}</td>
                    <td className="text-right py-2">{product.favorites}</td>
                    <td className="text-right py-2">{product.reviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
