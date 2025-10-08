import { prisma } from "@/lib/prisma";
import EmptyReviewsState from "@/components/admin/EmptyReviewsState";
import Image from "next/image";

interface ReviewsManagementProps {
  searchParams: Promise<{ action?: string }>;
}

export default async function ReviewsManagement({
  searchParams,
}: ReviewsManagementProps) {
  const { action } = await searchParams;

  try {
    // Fetch reviews from the database
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          select: {
            name: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no reviews found, show empty state
    if (reviews.length === 0) {
      return <EmptyReviewsState action={action} />;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Review Management
            </h1>
            <p className="text-gray-600">
              Manage customer reviews ({reviews.length} reviews)
            </p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">👤</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.user.name || "Anonymous"}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {review.comment}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Review for: {review.product.name}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return <EmptyReviewsState action={action} />;
  }
}
