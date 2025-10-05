export interface ReviewTypes {
 _id: string;
 name: string;
 rating: number;
 description: string;
 location: string;
 image: {
   asset: {
     url: string;
   };
   alt: string;
 };
}