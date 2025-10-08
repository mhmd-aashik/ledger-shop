"use client";

import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Eye } from "lucide-react";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CarouselManagement() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch carousels from database
  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await fetch("/api/carousel");
        if (response.ok) {
          const data = await response.json();
          setSlides(data);
        }
      } catch (error) {
        console.error("Error fetching carousels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarousels();
  }, []);

  const handleAddSlide = () => {
    setEditingSlide(null);
    setIsDialogOpen(true);
  };

  const handleEditSlide = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setIsDialogOpen(true);
  };

  const handleDeleteSlide = async (id: string) => {
    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSlides(slides.filter((slide) => slide.id !== id));
      }
    } catch (error) {
      console.error("Error deleting carousel:", error);
    }
  };

  const handleToggleActive = async (id: string) => {
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;

    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...slide,
          isActive: !slide.isActive,
        }),
      });
      if (response.ok) {
        setSlides(
          slides.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
        );
      }
    } catch (error) {
      console.error("Error updating carousel:", error);
    }
  };

  const handleSaveSlide = async (slideData: Partial<CarouselSlide>) => {
    try {
      if (editingSlide) {
        const response = await fetch(`/api/carousel/${editingSlide.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slideData),
        });
        if (response.ok) {
          const updatedSlide = await response.json();
          setSlides(
            slides.map((slide) =>
              slide.id === editingSlide.id ? updatedSlide : slide
            )
          );
          setIsDialogOpen(false);
        } else {
          const errorData = await response.json();
          console.error("Error updating carousel:", errorData);
          alert(
            `Error updating carousel: ${errorData.error || "Unknown error"}`
          );
        }
      } else {
        const response = await fetch("/api/carousel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slideData),
        });
        if (response.ok) {
          const newSlide = await response.json();
          setSlides([...slides, newSlide]);
          setIsDialogOpen(false);
        } else {
          const errorData = await response.json();
          console.error("Error creating carousel:", errorData);
          alert(
            `Error creating carousel: ${errorData.error || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      console.error("Error saving carousel:", error);
      alert("Network error occurred while saving carousel");
    }
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Loading carousels...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide) => (
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
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{slide.title}</CardTitle>
                <CardDescription>{slide.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {slide.description}
                </p>
                <div className="flex items-center justify-end space-x-1">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
    isActive: slide?.isActive ?? true,
    link: slide?.link || "",
    linkText: slide?.linkText || "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/carousel/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const { url } = await response.json();
        console.log("Image uploaded successfully:", url);
        setFormData({ ...formData, image: url });
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data being submitted:", formData);
    console.log("Image URL:", formData.image);

    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.subtitle.trim() ||
      !formData.description.trim() ||
      !formData.image.trim() ||
      !formData.link.trim() ||
      !formData.linkText.trim()
    ) {
      alert(
        "Please fill in all required fields (Title, Subtitle, Description, and Image)"
      );
      return;
    }

    // Validate character limits
    if (formData.title.length > 100) {
      alert("Title must be less than 100 characters");
      return;
    }
    if (formData.subtitle.length > 150) {
      alert("Subtitle must be less than 150 characters");
      return;
    }
    if (formData.description.length > 500) {
      alert("Description must be less than 500 characters");
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Title and Subtitle Row */}
      <div className="space-y-1">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter carousel title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          maxLength={100}
          required
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.title.length}/100 characters
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="subtitle" className="text-sm font-medium text-gray-700">
          Subtitle <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
          placeholder="Enter carousel subtitle"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          maxLength={150}
          required
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.subtitle.length}/150 characters
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="link" className="text-sm font-medium text-gray-700">
            Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="Enter carousel link"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="linkText"
            className="text-sm font-medium text-gray-700"
          >
            Link Text <span className="text-red-500">*</span>
          </Label>
          <Input
            id="linkText"
            value={formData.linkText}
            onChange={(e) =>
              setFormData({ ...formData, linkText: e.target.value })
            }
            placeholder="Enter carousel link text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter carousel description"
          rows={4}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          required
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Enter a compelling description for your carousel slide
          </p>
          <p className="text-xs text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm font-medium text-gray-700">
            Image <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-500">
            Upload an image for your carousel slide (PNG, JPG, GIF up to 5MB)
          </p>
        </div>

        <div className="space-y-4">
          {/* Upload Progress */}
          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-blue-700 font-medium text-sm">
                    Uploading image...
                  </span>
                </div>
                <span className="text-blue-600 font-semibold text-sm">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {formData.image && !uploading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-30 h-24 rounded-lg border-2 border-green-200 shadow-sm overflow-hidden">
                    {/* Use regular img tag for Vercel Blob URLs to avoid Next.js Image issues */}
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", formData.image);
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                      onLoad={() => {
                        console.log(
                          "Image loaded successfully:",
                          formData.image
                        );
                      }}
                    />
                    {/* Fallback image */}
                    <div
                      className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs"
                      style={{ display: "none" }}
                    >
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto mb-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>Image Preview</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Image uploaded successfully
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Ready to use in your carousel
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Unified Upload Area */}
          {!formData.image && !uploading && (
            <div className="relative">
              {/* Hidden File Input */}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {/* Visual Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragActive
                    ? "border-blue-400 bg-blue-50 scale-105"
                    : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("image")?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div
                    className={`p-4 rounded-full transition-colors ${
                      dragActive ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`h-10 w-10 transition-colors ${
                        dragActive ? "text-blue-500" : "text-gray-400"
                      }`}
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium text-gray-700">
                      <span className="text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <Label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            Make this carousel slide active
          </Label>
        </div>
        <div className="text-xs text-gray-500">
          {formData.isActive
            ? "Will be visible on homepage"
            : "Hidden from homepage"}
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-2.5 text-gray-700 bg-white border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={uploading}
          className="w-full sm:w-auto px-6 py-2.5 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Uploading...</span>
            </div>
          ) : slide ? (
            "Update Slide"
          ) : (
            "Add Slide"
          )}
        </Button>
      </div>
    </form>
  );
}
