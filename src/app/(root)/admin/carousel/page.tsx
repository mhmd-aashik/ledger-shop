"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, ArrowUp, ArrowDown } from "lucide-react";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
}

export default function CarouselManagement() {
  const [slides, setSlides] = useState<CarouselSlide[]>([
    {
      id: "1",
      title: "Luxury Leather Collection",
      subtitle: "Handcrafted Excellence",
      description:
        "Discover our premium collection of handcrafted leather goods, made with the finest materials and traditional techniques.",
      image: "/assets/images/leather1.jpg",
      buttonText: "Shop Now",
      buttonLink: "/products",
      isActive: true,
      order: 1,
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle: "Fresh Styles",
      description:
        "Explore our latest collection of modern leather accessories designed for the contemporary lifestyle.",
      image: "/assets/images/leather2.jpg",
      buttonText: "View Collection",
      buttonLink: "/products?filter=new",
      isActive: true,
      order: 2,
    },
    {
      id: "3",
      title: "Limited Edition",
      subtitle: "Exclusive Designs",
      description:
        "Get your hands on our limited edition pieces before they're gone forever.",
      image: "/assets/images/leather3.jpg",
      buttonText: "Shop Limited",
      buttonLink: "/products?filter=limited",
      isActive: false,
      order: 3,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);

  const handleAddSlide = () => {
    setEditingSlide(null);
    setIsDialogOpen(true);
  };

  const handleEditSlide = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setIsDialogOpen(true);
  };

  const handleDeleteSlide = (id: string) => {
    setSlides(slides.filter((slide) => slide.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id ? { ...slide, isActive: !slide.isActive } : slide
      )
    );
  };

  const handleMoveSlide = (id: string, direction: "up" | "down") => {
    const currentIndex = slides.findIndex((slide) => slide.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < slides.length) {
      const newSlides = [...slides];
      [newSlides[currentIndex], newSlides[newIndex]] = [
        newSlides[newIndex],
        newSlides[currentIndex],
      ];
      setSlides(
        newSlides.map((slide, index) => ({ ...slide, order: index + 1 }))
      );
    }
  };

  const handleSaveSlide = (slideData: Partial<CarouselSlide>) => {
    if (editingSlide) {
      setSlides(
        slides.map((slide) =>
          slide.id === editingSlide.id ? { ...slide, ...slideData } : slide
        )
      );
    } else {
      const newSlide: CarouselSlide = {
        id: Date.now().toString(),
        title: slideData.title || "",
        subtitle: slideData.subtitle || "",
        description: slideData.description || "",
        image: slideData.image || "",
        buttonText: slideData.buttonText || "",
        buttonLink: slideData.buttonLink || "",
        isActive: slideData.isActive ?? true,
        order: slides.length + 1,
      };
      setSlides([...slides, newSlide]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Carousel Management
          </h1>
          <p className="text-gray-600">Manage your homepage carousel slides</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSlide}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? "Edit Slide" : "Add New Slide"}
              </DialogTitle>
              <DialogDescription>
                {editingSlide
                  ? "Update the slide details"
                  : "Create a new carousel slide"}
              </DialogDescription>
            </DialogHeader>
            <CarouselSlideForm
              slide={editingSlide}
              onSave={handleSaveSlide}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="overflow-hidden">
            <div className="relative">
              <Image
                src={slide.image}
                alt={slide.title}
                width={400}
                height={192}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={slide.isActive ? "default" : "secondary"}>
                  {slide.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="outline">#{slide.order}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{slide.title}</CardTitle>
              <CardDescription>{slide.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {slide.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveSlide(slide.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveSlide(slide.id, "down")}
                    disabled={index === slides.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditSlide(slide)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(slide.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface CarouselSlideFormProps {
  slide: CarouselSlide | null;
  onSave: (slideData: Partial<CarouselSlide>) => void;
  onCancel: () => void;
}

function CarouselSlideForm({
  slide,
  onSave,
  onCancel,
}: CarouselSlideFormProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    image: slide?.image || "",
    buttonText: slide?.buttonText || "",
    buttonLink: slide?.buttonLink || "",
    isActive: slide?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={formData.buttonText}
            onChange={(e) =>
              setFormData({ ...formData, buttonText: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="buttonLink">Button Link</Label>
          <Input
            id="buttonLink"
            value={formData.buttonLink}
            onChange={(e) =>
              setFormData({ ...formData, buttonLink: e.target.value })
            }
            placeholder="/products"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="rounded border-gray-300"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{slide ? "Update Slide" : "Add Slide"}</Button>
      </div>
    </form>
  );
}
