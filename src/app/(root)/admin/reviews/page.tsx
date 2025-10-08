import { prisma } from "@/lib/prisma";
import EmptyReviewsState from "@/components/admin/EmptyReviewsState";
import ReviewsClient from "@/components/admin/ReviewsClient";

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

    // Transform reviews to match the expected interface
    const transformedReviews = reviews.map((review) => ({
      ...review,
      title: review.title || undefined,
      comment: review.comment || undefined,
      createdAt: review.createdAt.toISOString(),
      user: {
        ...review.user,
        name: review.user.name || undefined,
        image: review.user.image || undefined,
      },
    }));

    return (
      <ReviewsClient initialReviews={transformedReviews} action={action} />
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return <EmptyReviewsState action={action} />;
  }
}
