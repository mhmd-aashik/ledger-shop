import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users with their order statistics
    const users = await prisma.user.findMany({
      include: {
        orders: {
          where: {
            paymentStatus: "PAID",
          },
          select: {
            totalAmount: true,
            createdAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        profile: {
          select: {
            phone: true,
          },
        },
        addresses: {
          where: {
            isDefault: true,
          },
          select: {
            address1: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format customer data
    const customers = users.map((user) => {
      const totalSpent = user.orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0
      );
      const totalOrders = user.orders.length;
      const averageRating =
        user.reviews.length > 0
          ? user.reviews.reduce((sum, review) => sum + review.rating, 0) /
            user.reviews.length
          : 0;

      const lastOrder =
        user.orders.length > 0
          ? user.orders.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0]
          : null;

      const defaultAddress = user.addresses[0];

      return {
        id: user.id,
        name:
          user.name ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unknown",
        email: user.email,
        phone: user.profile?.phone,
        avatar: user.imageUrl || user.image,
        totalOrders,
        totalSpent,
        averageRating,
        lastOrderDate: lastOrder
          ? lastOrder.createdAt.toISOString().split("T")[0]
          : undefined,
        joinDate: user.createdAt.toISOString().split("T")[0],
        status: totalOrders > 0 ? "active" : "inactive",
        address: defaultAddress
          ? {
              street: defaultAddress.address1,
              city: defaultAddress.city,
              state: defaultAddress.state,
              zipCode: defaultAddress.postalCode,
              country: defaultAddress.country,
            }
          : undefined,
      };
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Customers API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers data" },
      { status: 500 }
    );
  }
}
