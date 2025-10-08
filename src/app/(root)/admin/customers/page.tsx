import { prisma } from "@/lib/prisma";
import EmptyCustomersState from "@/components/admin/EmptyCustomersState";
import Image from "next/image";

interface CustomersManagementProps {
  searchParams: Promise<{ action?: string }>;
}

export default async function CustomersManagement({
  searchParams,
}: CustomersManagementProps) {
  const { action } = await searchParams;

  try {
    // Fetch customers from the database
    const customers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no customers found, show empty state
    if (customers.length === 0) {
      return <EmptyCustomersState action={action} />;
    }

    // Transform customers for display
    const customersWithCount = customers.map((customer) => ({
      id: customer.id,
      name:
        customer.name ||
        (customer.firstName && customer.lastName
          ? `${customer.firstName} ${customer.lastName}`
          : customer.firstName || customer.lastName || "No Name"),
      email: customer.email,
      image: customer.image,
      orderCount: customer._count.orders,
      createdAt: customer.createdAt.toISOString(),
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customer Management
            </h1>
            <p className="text-gray-600">
              Manage your customers ({customersWithCount.length} customers)
            </p>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {customersWithCount.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  {customer.image ? (
                    <Image
                      src={customer.image}
                      alt={customer.name || "Customer"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-lg">👤</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.name || "No Name"}
                    </h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span>🛒</span>
                    <span>{customer.orderCount} orders</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return <EmptyCustomersState action={action} />;
  }
}
