export interface CarouselTypes {
  _id: string;
  _type: "carousel";
  title: string;
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  order: number;
  cta?: string;
  ctaLink?: string;
  isActive?: boolean;
  _createdAt: string;
  _updatedAt: string;
}
