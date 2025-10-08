import { prisma } from "@/lib/prisma";
import CarouselClient from "@/components/admin/CarouselClient";
import EmptyCarouselState from "@/components/admin/EmptyCarouselState";

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

    // Convert dates to ISO strings for client component
    const slidesWithDates = carouselItems.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return <CarouselClient initialSlides={slidesWithDates} action={action} />;
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return <EmptyCarouselState action={action} />;
  }
}
