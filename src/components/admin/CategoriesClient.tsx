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
  DialogTrigger,
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
  Folder,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

interface CategoriesClientProps {
  initialCategories: Category[];
  action?: string;
}

export default function CategoriesClient({
  initialCategories,
  action,
}: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update categories when initialCategories change
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Check for action=create prop and open modal
  useEffect(() => {
    if (action === "create") {
      setIsDialogOpen(true);
    }
  }, [action]);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.isActive) ||
      (statusFilter === "inactive" && !category.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== categoryId));
        toast.success("Category deleted successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-slate-600 text-lg mt-2">
            Organize your products into categories ({filteredCategories.length}{" "}
            categories)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category information below."
                  : "Fill in the details to create a new category."}
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              saving={saving}
              onSave={async (categoryData) => {
                setSaving(true);
                try {
                  const url = editingCategory
                    ? `/api/categories/${editingCategory.id}`
                    : "/api/categories";
                  const method = editingCategory ? "PUT" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(categoryData),
                  });

                  if (response.ok) {
                    const updatedCategory = await response.json();
                    if (editingCategory) {
                      setCategories(
                        categories.map((c) =>
                          c.id === editingCategory.id ? updatedCategory : c
                        )
                      );
                      toast.success("Category updated successfully");
                    } else {
                      setCategories([updatedCategory, ...categories]);
                      toast.success("Category created successfully");
                    }
                    setIsDialogOpen(false);
                  } else {
                    const error = await response.json();
                    toast.error(error.error || "Failed to save category");
                  }
                } catch (error) {
                  console.error("Error saving category:", error);
                  toast.error("Failed to save category");
                } finally {
                  setSaving(false);
                }
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Filters
              </CardTitle>
              <p className="text-slate-600 text-sm">
                Filter and search your categories
              </p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label
                htmlFor="search"
                className="text-sm font-semibold text-slate-700"
              >
                Search Categories
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-200 rounded-xl shadow-sm"
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="status"
                className="text-sm font-semibold text-slate-700"
              >
                Status
              </Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full px-3 py-3 bg-white/70 border border-white/30 focus:bg-white/90 transition-all duration-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Categories
              </CardTitle>
              <CardDescription className="text-slate-600">
                A list of all categories in your store.
              </CardDescription>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
              <Folder className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/30">
                  <TableHead className="text-slate-700 font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold">
                    Description
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold">
                    Products
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold">
                    Sort Order
                  </TableHead>
                  <TableHead className="text-right text-slate-700 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Folder className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            No categories found
                          </h3>
                          <p className="text-slate-600 mb-4">
                            {categories.length === 0
                              ? "Get started by adding your first category to organize your products."
                              : "No categories match your current filters. Try adjusting your search or status filter."}
                          </p>
                          {categories.length === 0 && (
                            <Button
                              onClick={handleAddCategory}
                              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Add Your First Category
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="border-white/30 hover:bg-white/50 transition-colors duration-200"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={56}
                                height={56}
                                className="h-14 w-14 rounded-xl object-cover shadow-md"
                              />
                            ) : (
                              <div className="h-14 w-14 bg-gray-200 rounded-xl flex items-center justify-center">
                                <Folder className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 truncate">
                              {category.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {category.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-slate-600 truncate">
                            {category.description || "No description"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold text-slate-900">
                            {category.productCount}
                          </span>
                          <span className="text-sm text-slate-500">
                            products
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                          className={`${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900">
                          #{category.sortOrder}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-xl hover:bg-white/60 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white/95 backdrop-blur-md border border-white/30 shadow-xl rounded-xl"
                          >
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category)}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// CategoryForm component
interface CategoryFormProps {
  category: Category | null;
  saving: boolean;
  onSave: (categoryData: Partial<Category>) => void;
  onCancel: () => void;
}

function CategoryForm({
  category,
  saving,
  onSave,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || "",
    sortOrder: category?.sortOrder || 0,
    isActive: category?.isActive ?? true,
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const response = await fetch("/api/upload", {
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

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    toast.success("Image removed");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="category-slug"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          placeholder="Describe this category"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) =>
              setFormData({
                ...formData,
                sortOrder: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
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
            className="rounded border-gray-300"
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="image-upload">Category Image</Label>
        <div className="mt-2">
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Image"}</span>
          </Button>
        </div>

        {formData.image && (
          <div className="mt-4">
            <div className="relative w-32 h-32">
              <Image
                src={formData.image}
                alt="Category preview"
                fill
                className="object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-1 right-1"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => onSave(formData)}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{category ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <>
              <span>{category ? "Update Category" : "Create Category"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
