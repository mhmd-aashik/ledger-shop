import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const period = searchParams.get("period") || "30";
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get comprehensive analytics data
    const [
      orders,
      products,
      customers,
      revenue,
      topProducts,
      orderStatusDistribution,
      customerGrowth,
    ] = await Promise.all([
      // Orders data
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
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
      }),

      // Products data
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        include: {
          category: true,
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
        },
      }),

      // Customers data
      prisma.user.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        include: {
          orders: {
            where: {
              createdAt: { gte: startDate },
            },
          },
          _count: {
            select: {
              orders: true,
              favorites: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      // Revenue data by month
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM("totalAmount") as revenue,
          COUNT(*) as orders
        FROM "orders" 
        WHERE "paymentStatus" = 'PAID' 
          AND "createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `,

      // Top products by revenue
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
      }),

      // Order status distribution
      prisma.order.groupBy({
        by: ["status"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: {
          status: true,
        },
      }),

      // Customer growth by month
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as new_customers
        FROM "users" 
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `,

      // Product performance
      prisma.product.findMany({
        where: {
          isActive: true,
        },
        include: {
          category: true,
          orderItems: {
            where: {
              order: {
                createdAt: { gte: startDate },
                paymentStatus: "PAID",
              },
            },
          },
          _count: {
            select: {
              favorites: true,
              reviews: true,
            },
          },
        },
      }),
    ]);

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
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const reportData = {
      period: `${period} days`,
      generatedAt: new Date().toISOString(),
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce(
          (sum, order) => sum + Number(order.totalAmount),
          0
        ),
        totalCustomers: customers.length,
        totalProducts: products.length,
        averageOrderValue:
          orders.length > 0
            ? orders.reduce(
                (sum, order) => sum + Number(order.totalAmount),
                0
              ) / orders.length
            : 0,
      },
      orders: orders.map((order) => ({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
          total: Number(item.total),
        })),
      })),
      products: products.map((product) => ({
        name: product.name,
        category: product.category.name,
        price: Number(product.price),
        totalSales: product._count.orderItems,
        totalRevenue: 0, // This would need to be calculated from orderItems if available
        favorites: product._count.favorites,
        reviews: product._count.reviews,
      })),
      customers: customers.map((customer) => ({
        name:
          `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
          "N/A",
        email: customer.email,
        totalOrders: customer._count.orders,
        totalSpent: customer.orders.reduce(
          (sum, order) => sum + Number(order.totalAmount),
          0
        ),
        favorites: customer._count.favorites,
        createdAt: customer.createdAt,
      })),
      topProducts: topProducts.map((product, index) => {
        const details = topProductDetails.find(
          (p) => p.id === product.productId
        );
        return {
          rank: index + 1,
          name: details?.name || "Unknown Product",
          category: details?.category?.name || "Unknown",
          price: Number(details?.price || 0),
          revenue: Number(product._sum.total || 0),
          sales: Number(product._sum.quantity || 0),
          orders: Number(product._count.productId || 0),
        };
      }),
      revenueByMonth: (
        revenue as Array<{ month: Date; revenue: number; orders: number }>
      ).map((item) => ({
        month: item.month.toISOString().split("T")[0],
        revenue: Number(item.revenue),
        orders: Number(item.orders),
      })),
      customerGrowth: (
        customerGrowth as Array<{ month: Date; new_customers: number }>
      ).map((item) => ({
        month: item.month.toISOString().split("T")[0],
        newCustomers: Number(item.new_customers),
      })),
      orderStatusDistribution: orderStatusDistribution.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
    };

    if (format === "json") {
      return NextResponse.json(reportData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="analytics-report-${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    // Generate CSV format
    const csvData = generateCSV(reportData);

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="analytics-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Analytics export error:", error);
    return NextResponse.json(
      { error: "Failed to export analytics data" },
      { status: 500 }
    );
  }
}

interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  items: {
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

interface ProductData {
  name: string;
  category: string;
  price: number;
  totalSales: number;
  totalRevenue: number;
  favorites: number;
  reviews: number;
}

interface CustomerData {
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  favorites: number;
  createdAt: Date;
}

interface TopProductData {
  rank: number;
  name: string;
  category: string;
  price: number;
  revenue: number;
  sales: number;
  orders: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface CustomerGrowthData {
  month: string;
  newCustomers: number;
}

interface OrderStatusData {
  status: string;
  count: number;
}

interface AnalyticsReportData {
  period: string;
  generatedAt: string;
  summary: AnalyticsSummary;
  orders: OrderData[];
  products: ProductData[];
  customers: CustomerData[];
  topProducts: TopProductData[];
  revenueByMonth: RevenueData[];
  customerGrowth: CustomerGrowthData[];
  orderStatusDistribution: OrderStatusData[];
}

function generateCSV(data: AnalyticsReportData): string {
  const lines: string[] = [];

  // Summary
  lines.push("ANALYTICS REPORT SUMMARY");
  lines.push(`Period: ${data.period}`);
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push("");
  lines.push("SUMMARY METRICS");
  lines.push(`Total Orders,${data.summary.totalOrders}`);
  lines.push(`Total Revenue,$${data.summary.totalRevenue.toFixed(2)}`);
  lines.push(`Total Customers,${data.summary.totalCustomers}`);
  lines.push(`Total Products,${data.summary.totalProducts}`);
  lines.push(
    `Average Order Value,$${data.summary.averageOrderValue.toFixed(2)}`
  );
  lines.push("");

  // Orders
  lines.push("ORDERS");
  lines.push(
    "Order Number,Customer Name,Customer Email,Status,Payment Status,Total Amount,Created At"
  );
  data.orders.forEach((order) => {
    lines.push(
      `"${order.orderNumber}","${order.customerName}","${order.customerEmail}","${order.status}","${order.paymentStatus}",$${order.totalAmount.toFixed(2)},"${order.createdAt.toISOString()}"`
    );
  });
  lines.push("");

  // Products
  lines.push("PRODUCTS");
  lines.push("Name,Category,Price,Total Sales,Total Revenue,Favorites,Reviews");
  data.products.forEach((product) => {
    lines.push(
      `"${product.name}","${product.category}","$${product.price.toFixed(2)}",${product.totalSales},"$${product.totalRevenue.toFixed(2)}",${product.favorites},${product.reviews}`
    );
  });
  lines.push("");

  // Top Products
  lines.push("TOP PRODUCTS");
  lines.push("Rank,Name,Category,Price,Revenue,Sales,Orders");
  data.topProducts.forEach((product) => {
    lines.push(
      `${product.rank},"${product.name}","${product.category}","$${product.price.toFixed(2)}","$${product.revenue.toFixed(2)}",${product.sales},${product.orders}`
    );
  });
  lines.push("");

  // Revenue by Month
  lines.push("REVENUE BY MONTH");
  lines.push("Month,Revenue,Orders");
  data.revenueByMonth.forEach((item) => {
    lines.push(`"${item.month}","$${item.revenue.toFixed(2)}",${item.orders}`);
  });
  lines.push("");

  // Customer Growth
  lines.push("CUSTOMER GROWTH");
  lines.push("Month,New Customers");
  data.customerGrowth.forEach((item) => {
    lines.push(`"${item.month}",${item.newCustomers}`);
  });
  lines.push("");

  // Order Status Distribution
  lines.push("ORDER STATUS DISTRIBUTION");
  lines.push("Status,Count");
  data.orderStatusDistribution.forEach((item) => {
    lines.push(`"${item.status}",${item.count}`);
  });

  return lines.join("\n");
}
