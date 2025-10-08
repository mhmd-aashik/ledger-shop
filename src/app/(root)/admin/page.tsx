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
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "2,350",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: "1,234",
      change: "+2.5%",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      title: "Active Customers",
      value: "573",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Sarah Johnson",
      amount: "$299.00",
      status: "processing",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Mike Chen",
      amount: "$149.50",
      status: "shipped",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "Emily Davis",
      amount: "$89.99",
      status: "delivered",
      date: "2024-01-13",
    },
    {
      id: "ORD-004",
      customer: "David Wilson",
      amount: "$199.00",
      status: "pending",
      date: "2024-01-12",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock },
      processing: { variant: "default" as const, icon: Clock },
      shipped: { variant: "default" as const, icon: TrendingUp },
      delivered: { variant: "default" as const, icon: CheckCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
        {stats.map((stat, index) => {
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
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 transition-all duration-200 hover:shadow-md"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {order.id}
                    </p>
                    <p className="text-sm text-slate-600">{order.customer}</p>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-slate-900">
                      {order.amount}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
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
              <button className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Add Product
                </span>
              </button>
              <button className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  View Orders
                </span>
              </button>
              <button className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  Manage Reviews
                </span>
              </button>
              <button className="group flex flex-col items-center p-6 bg-white/50 rounded-xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:shadow-xl transition-shadow duration-200 mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  View Customers
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
