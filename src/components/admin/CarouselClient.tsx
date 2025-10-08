"use client";

import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  Loader2,
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string | null;
  linkText?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CarouselClientProps {
  initialSlides: CarouselSlide[];
  action?: string;
}

export default function CarouselClient({
  initialSlides,
  action,
}: CarouselClientProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(initialSlides);
  const [filteredSlides, setFilteredSlides] =
    useState<CarouselSlide[]>(initialSlides);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(
    action === "create"
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<CarouselSlide | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    link: "",
    linkText: "",
    isActive: true,
  });

  // Filter slides based on search term
  useEffect(() => {
    const filtered = slides.filter(
      (slide) =>
        slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slide.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSlides(filtered);
  }, [slides, searchTerm]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      link: "",
      linkText: "",
      isActive: true,
    });
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/carousel/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        image: result.url,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle create slide
  const handleCreateSlide = async () => {
    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      !formData.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/carousel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create slide");
      }

      const newSlide = await response.json();
      setSlides([newSlide, ...slides]);
      setIsCreateModalOpen(false);
      resetForm();
      toast.success("Slide created successfully");
    } catch (error) {
      console.error("Error creating slide:", error);
      toast.error("Failed to create slide");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update slide
  const handleUpdateSlide = async () => {
    if (
      !selectedSlide ||
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      !formData.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/carousel/${selectedSlide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update slide");
      }

      const updatedSlide = await response.json();
      setSlides(
        slides.map((slide) =>
          slide.id === selectedSlide.id ? updatedSlide : slide
        )
      );
      setIsEditModalOpen(false);
      setSelectedSlide(null);
      resetForm();
      toast.success("Slide updated successfully");
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("Failed to update slide");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete slide
  const handleDeleteSlide = async () => {
    if (!selectedSlide) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/carousel/${selectedSlide.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete slide");
      }

      setSlides(slides.filter((slide) => slide.id !== selectedSlide.id));
      setIsDeleteModalOpen(false);
      setSelectedSlide(null);
      toast.success("Slide deleted successfully");
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      const response = await fetch(`/api/carousel/${slide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !slide.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update slide");
      }

      const updatedSlide = await response.json();
      setSlides(slides.map((s) => (s.id === slide.id ? updatedSlide : s)));
      toast.success(
        `Slide ${updatedSlide.isActive ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("Failed to update slide");
    }
  };

  // Open edit modal
  const openEditModal = (slide: CarouselSlide) => {
    setSelectedSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      link: slide.link || "",
      linkText: slide.linkText || "",
      isActive: slide.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (slide: CarouselSlide) => {
    setSelectedSlide(slide);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Carousel Management
          </h1>
          <p className="text-gray-600">
            Manage your homepage carousel ({slides.length} slides)
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search slides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Slides Table */}
      <Card>
        <CardHeader>
          <CardTitle>Carousel Slides</CardTitle>
          <CardDescription>
            Manage your homepage carousel slides
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSlides.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "No slides found matching your search"
                  : "No slides available"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSlides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{slide.title}</TableCell>
                    <TableCell>{slide.subtitle}</TableCell>
                    <TableCell>
                      <Badge variant={slide.isActive ? "default" : "secondary"}>
                        {slide.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(slide.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditModal(slide)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(slide)}
                          >
                            {slide.isActive ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(slide)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Slide</DialogTitle>
            <DialogDescription>
              Add a new slide to your homepage carousel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter slide title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Enter slide subtitle"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter slide description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image">Image *</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  disabled={uploading}
                  className="flex items-center space-x-2"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                </Button>
              </div>

              {formData.image && (
                <div className="mt-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={formData.image}
                      alt="Carousel preview"
                      fill
                      className="object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-1 right-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="link">Link (optional)</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="Enter link URL"
              />
            </div>
            <div>
              <Label htmlFor="linkText">Link Text (optional)</Label>
              <Input
                id="linkText"
                value={formData.linkText}
                onChange={(e) =>
                  setFormData({ ...formData, linkText: e.target.value })
                }
                placeholder="Enter link text"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSlide} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Slide
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Slide</DialogTitle>
            <DialogDescription>Update the slide information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter slide title"
              />
            </div>
            <div>
              <Label htmlFor="edit-subtitle">Subtitle *</Label>
              <Input
                id="edit-subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Enter slide subtitle"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter slide description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Image *</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="edit-image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("edit-image")?.click()}
                  disabled={uploading}
                  className="flex items-center space-x-2"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                </Button>
              </div>

              {formData.image && (
                <div className="mt-4">
                  <div className="relative w-32 h-32">
                    <Image
                      src={formData.image}
                      alt="Carousel preview"
                      fill
                      className="object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-1 right-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="edit-link">Link (optional)</Label>
              <Input
                id="edit-link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="Enter link URL"
              />
            </div>
            <div>
              <Label htmlFor="edit-linkText">Link Text (optional)</Label>
              <Input
                id="edit-linkText"
                value={formData.linkText}
                onChange={(e) =>
                  setFormData({ ...formData, linkText: e.target.value })
                }
                placeholder="Enter link text"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedSlide(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateSlide} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Slide
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Slide</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedSlide?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedSlide(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSlide}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
