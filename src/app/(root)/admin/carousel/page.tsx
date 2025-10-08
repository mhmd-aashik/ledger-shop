import { prisma } from "@/lib/prisma";
import EmptyCarouselState from "@/components/admin/EmptyCarouselState";
import Image from "next/image";

interface CarouselManagementProps {
  searchParams: Promise<{ action?: string }>;
}

export default async function CarouselManagement({
  searchParams,
}: CarouselManagementProps) {
  const { action } = await searchParams;

  try {
    // Fetch carousel items from the database
    const carouselItems = await prisma.carousel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no carousel items found, show empty state
    if (carouselItems.length === 0) {
      return <EmptyCarouselState action={action} />;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Carousel Management
            </h1>
            <p className="text-gray-600">
              Manage your homepage carousel ({carouselItems.length} items)
            </p>
          </div>
        </div>

        {/* Carousel Items Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <div
                      className="h-12 w-12 text-gray-400"
                      aria-label="Image placeholder"
                    >
                      🖼️
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                {item.linkText && (
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Button: {item.linkText}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Link: {item.link || "None"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return <EmptyCarouselState action={action} />;
  }
}
