import { heroSlides } from "@/data/hero-slides";
import { fetchCarousel } from "@/lib/actions/fetch-carousel.action";
import CarouselClient from "./CarouselClient";

export default async function HeroCarousel() {
  const carouselData = await fetchCarousel();

  console.log(JSON.stringify(carouselData, null, 2));

  // Use Sanity data if available, otherwise fallback to static data
  const slides =
    carouselData && carouselData.length > 0 ? carouselData : heroSlides;

  return <CarouselClient slides={slides} />;
}
