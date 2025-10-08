import { prisma } from "@/lib/prisma";
import CategoriesClient from "@/components/admin/CategoriesClient";

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
      <CategoriesClient
        initialCategories={categoriesWithCount}
        action={action}
      />
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <CategoriesClient initialCategories={[]} action={action} />;
  }
}
