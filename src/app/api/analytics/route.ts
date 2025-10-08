import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    console.log("Analytics API called");
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you might want to add an admin role to your User model)
    // For now, we'll assume all authenticated users can access analytics

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    console.log("Analytics API - Period:", period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get key metrics
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      averageOrderValue,
      topProducts,
      recentOrders,
      orderStatusDistribution,
      revenueByMonth,
      customerGrowth,
      productPerformance,
    ] = await Promise.all([
      // Total Revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          paymentStatus: "PAID",
        },
        _sum: { totalAmount: true },
      }),

      // Total Orders
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total Customers
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),

      // Total Products
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      // Average Order Value
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          paymentStatus: "PAID",
        },
        _avg: { totalAmount: true },
      }),

      // Top Products by revenue
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            createdAt: { gte: startDate },
            paymentStatus: "PAID",
          },
        },
        _sum: {
          total: true,
          quantity: true,
        },
        _count: {
          productId: true,
        },
        orderBy: {
          _sum: {
            total: "desc",
          },
        },
        take: 10,
      }),

      // Recent Orders
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      // Order Status Distribution
      prisma.order.groupBy({
        by: ["status"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: {
          status: true,
        },
      }),

      // Revenue by Month (last 12 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("totalAmount") as revenue
        FROM "orders" 
        WHERE "paymentStatus" = 'PAID' 
          AND "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `,

      // Customer Growth (last 12 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as new_customers
        FROM "users" 
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `,

      // Product Performance
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        include: {
          _count: {
            select: {
              orderItems: {
                where: {
                  order: {
                    createdAt: { gte: startDate },
                    paymentStatus: "PAID",
                  },
                },
              },
              favorites: true,
              reviews: true,
            },
          },
          orderItems: {
            where: {
              order: {
                createdAt: { gte: startDate },
                paymentStatus: "PAID",
              },
            },
            select: {
              quantity: true,
              total: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      }),
    ]);

    // Handle case where there's no data
    if (totalOrders === 0) {
      return NextResponse.json({
        overview: {
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers,
          totalProducts,
          averageOrderValue: 0,
          conversionRate: 0,
          revenueChange: 0,
          ordersChange: 0,
          customersChange: 0,
        },
        topProducts: [],
        recentActivity: [],
        orderStatusDistribution: [],
        revenueByMonth: [],
        customerGrowth: [],
        productPerformance: productPerformance.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          totalSales: 0,
          totalRevenue: 0,
          favorites: product._count.favorites,
          reviews: product._count.reviews,
          orders: 0,
        })),
        // Dashboard data for empty state
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts,
        totalCustomers,
        recentOrders: [],
      });
    }

    // Get product details for top products
    const topProductIds = topProducts.map((p) => p.productId);
    const topProductDetails = await prisma.product.findMany({
      where: {
        id: { in: topProductIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
        thumbnail: true,
      },
    });

    // Calculate previous period for comparison
    const previousStartDate = new Date();
    previousStartDate.setDate(
      previousStartDate.getDate() - parseInt(period) * 2
    );
    const previousEndDate = new Date(startDate);

    const [previousRevenue, previousOrders, previousCustomers] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            createdAt: {
              gte: previousStartDate,
              lt: previousEndDate,
            },
            paymentStatus: "PAID",
          },
          _sum: { totalAmount: true },
        }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: previousStartDate,
              lt: previousEndDate,
            },
          },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: previousStartDate,
              lt: previousEndDate,
            },
          },
        }),
      ]);

    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(
      Number(previousRevenue._sum.totalAmount || 0),
      Number(totalRevenue._sum.totalAmount || 0)
    );
    const ordersChange = calculatePercentageChange(previousOrders, totalOrders);
    const customersChange = calculatePercentageChange(
      previousCustomers,
      totalCustomers
    );

    // Format top products with details
    const formattedTopProducts = topProducts.map((product, index) => {
      const productDetails = topProductDetails.find(
        (p) => p.id === product.productId
      );
      return {
        rank: index + 1,
        id: product.productId,
        name: productDetails?.name || "Unknown Product",
        revenue: product._sum.total || 0,
        sales: product._sum.quantity || 0,
        orders: product._count.productId || 0,
        thumbnail: productDetails?.thumbnail,
      };
    });

    // Format recent activity
    const recentActivity = recentOrders.map((order) => ({
      type: "order",
      message: `New order #${order.orderNumber} from ${order.customerName}`,
      time: formatTimeAgo(order.createdAt),
      amount: Number(order.totalAmount),
      status: order.status,
    }));

    // Format order status distribution
    const totalOrderCount = orderStatusDistribution.reduce(
      (sum, item) => sum + item._count.status,
      0
    );
    const formattedOrderStatus = orderStatusDistribution.map((item) => ({
      status: item.status,
      count: item._count.status,
      percentage:
        totalOrderCount > 0
          ? Math.round((item._count.status / totalOrderCount) * 100)
          : 0,
    }));

    const analytics = {
      overview: {
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        totalOrders,
        totalCustomers,
        totalProducts,
        averageOrderValue: Number(averageOrderValue._avg.totalAmount || 0),
        conversionRate: 0, // Would need visitor tracking for real conversion rate
        revenueChange,
        ordersChange,
        customersChange,
      },
      topProducts: formattedTopProducts,
      recentActivity,
      orderStatusDistribution: formattedOrderStatus,
      revenueByMonth: (
        revenueByMonth as Array<{ month: Date; revenue: number }>
      ).map((item) => ({
        month: item.month.toISOString(),
        revenue: Number(item.revenue),
      })),
      customerGrowth: (
        customerGrowth as Array<{
          month: Date;
          new_customers: number;
        }>
      ).map((item) => ({
        month: item.month.toISOString(),
        new_customers: Number(item.new_customers),
      })),
      productPerformance: productPerformance.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        totalSales: product.orderItems.reduce(
          (sum, item) => sum + Number(item.quantity),
          0
        ),
        totalRevenue: product.orderItems.reduce(
          (sum, item) => sum + Number(item.total),
          0
        ),
        favorites: product._count.favorites,
        reviews: product._count.reviews,
        orders: product._count.orderItems,
      })),
    };

    // Also include dashboard-specific data
    const dashboardData = {
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders: recentOrders.map((order) => ({
        id: order.orderNumber || order.id,
        customerName:
          `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
          order.user.email,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({
      ...analytics,
      ...dashboardData,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

function calculatePercentageChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
