import { prisma } from "@/lib/prisma";
import EmptyCategoriesState from "@/components/admin/EmptyCategoriesState";
import Image from "next/image";

interface CategoryManagementProps {
  searchParams: Promise<{ action?: string }>;
}

export default async function CategoryManagement({
  searchParams,
}: CategoryManagementProps) {
  const { action } = await searchParams;

  try {
    // Fetch categories from the database
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no categories found, show empty state
    if (categories.length === 0) {
      return <EmptyCategoriesState action={action} />;
    }

    // Transform categories for display
    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      productCount: category._count.products,
      createdAt: category.createdAt.toISOString(),
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600">
              Organize your products into categories (
              {categoriesWithCount.length} categories)
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {categoriesWithCount.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <div className="h-12 w-12 text-gray-400">📁</div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs bg-white rounded-full border">
                    #{category.sortOrder}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span>📦</span>
                    <span>{category.productCount} products</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <EmptyCategoriesState action={action} />;
  }
}
