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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Star,
  MoreHorizontal,
  Loader2,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  sku?: string | null;
  barcode?: string | null;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  images: string[];
  video?: string | null;
  thumbnail?: string | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  tags: string[];
  features: string[];
  materials: string[];
  dimensions?: string | null;
  weight?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK";
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ProductsClient({
  initialProducts,
  initialCategories,
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update products when initialProducts change
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Update categories when initialCategories change
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku &&
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || product.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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
            Products
          </h1>
          <p className="text-slate-600 text-lg mt-2">
            Manage your product catalog ({filteredProducts.length} products)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the product information below."
                  : "Fill in the details to create a new product."}
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories}
              saving={saving}
              onSave={async (productData) => {
                setSaving(true);
                try {
                  const url = editingProduct
                    ? `/api/products/${editingProduct.id}`
                    : "/api/products";
                  const method = editingProduct ? "PUT" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                  });

                  if (response.ok) {
                    const updatedProduct = await response.json();
                    if (editingProduct) {
                      setProducts(
                        products.map((p) =>
                          p.id === editingProduct.id ? updatedProduct : p
                        )
                      );
                      toast.success("Product updated successfully");
                    } else {
                      setProducts([updatedProduct, ...products]);
                      toast.success("Product created successfully");
                    }
                    setIsDialogOpen(false);
                  } else {
                    const error = await response.json();
                    toast.error(error.error || "Failed to save product");
                  }
                } catch (error) {
                  console.error("Error saving product:", error);
                  toast.error("Failed to save product");
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
                Filter and search your products
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
                Search Products
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search by name or SKU..."
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-2 bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-200 rounded-xl shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border border-white/30 shadow-xl rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Products
              </CardTitle>
              <CardDescription className="text-slate-600">
                A list of all products in your store.
              </CardDescription>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/30">
                  <TableHead className="text-slate-700 font-semibold">
                    Product
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-slate-700 font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="text-slate-700 font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-slate-700 font-semibold">
                    Stock
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-slate-700 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-slate-700 font-semibold">
                    Rating
                  </TableHead>
                  <TableHead className="text-right text-slate-700 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-white/30 hover:bg-white/50 transition-colors duration-200"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Image
                            src={
                              product.images[0] || "/placeholder-product.jpg"
                            }
                            alt={product.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-xl object-cover shadow-md"
                          />
                          {product.isFeatured && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Star className="h-3 w-3 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {product.sku && `SKU: ${product.sku}`}
                          </div>
                          <div className="sm:hidden text-xs text-slate-400 mt-1">
                            {product.category?.name &&
                              `Category: ${product.category.name}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.category?.name || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-lg">
                          ${product.price}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-slate-500 line-through">
                            ${product.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">
                          {product.quantity}
                        </span>
                        {product.trackQuantity &&
                          product.quantity <= product.lowStockThreshold && (
                            <Badge
                              variant="destructive"
                              className="text-xs bg-red-100 text-red-800"
                            >
                              Low Stock
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant={
                          product.status === "PUBLISHED"
                            ? "default"
                            : product.status === "DRAFT"
                              ? "secondary"
                              : "outline"
                        }
                        className={`${
                          product.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : product.status === "DRAFT"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-slate-900">
                          {product.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({product.reviewCount})
                        </span>
                      </div>
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
                            onClick={() => handleEditProduct(product)}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:bg-red-50 transition-colors"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ProductForm component (simplified version for hydration fix)
interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  saving: boolean;
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
}

function ProductForm({
  product,
  categories,
  saving,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    costPrice: product?.costPrice || 0,
    categoryId: product?.categoryId || "",
    status: product?.status || "DRAFT",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    quantity: product?.quantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 5,
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    images: product?.images || [],
    video: product?.video || "",
    thumbnail: product?.thumbnail || "",
    tags: product?.tags || [],
    features: product?.features || [],
    materials: product?.materials || [],
    dimensions: product?.dimensions || "",
    weight: product?.weight || 0,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
    trackQuantity: product?.trackQuantity ?? true,
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
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

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map((result) => result.url);

      console.log("Upload results:", results);
      console.log("New image URLs:", newImageUrls);

      setFormData((prev) => {
        const updatedImages = [...prev.images, ...newImageUrls];
        console.log("Updated images array:", updatedImages);
        return {
          ...prev,
          images: updatedImages,
        };
      });

      toast.success(`${results.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "video");

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
        video: result.url,
      }));

      toast.success("Video uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success("Image removed");
  };

  const removeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: "",
    }));
    toast.success("Video removed");
  };

  const steps = [
    { id: 1, title: "Basic Info", description: "Product name and description" },
    { id: 2, title: "Pricing", description: "Price and inventory" },
    { id: 3, title: "Video", description: "Product video" },
    { id: 4, title: "Images", description: "Product images" },
    { id: 5, title: "Details", description: "Features and materials" },
    { id: 6, title: "SEO & Settings", description: "Search optimization" },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.name &&
          formData.slug &&
          formData.categoryId &&
          formData.description
        );
      case 2:
        return formData.price > 0;
      case 3:
        return true; // Media is optional
      case 4:
        return true; // Details are optional
      case 5:
        return true; // SEO is optional
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Step Progress */}
      <div className="mb-8 overflow-hidden">
        {/* Desktop Progress */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-1 overflow-x-auto pb-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep === step.id
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : currentStep > step.id
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </div>
                  <div className="ml-3 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {step.description}
                    </div>
                  </div>
                  {step.id < steps.length && (
                    <div className="w-8 h-0.5 bg-gray-200 mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex-shrink-0">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 flex-shrink-0 ${
                    currentStep === step.id
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : currentStep > step.id
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
              {currentStep}/{steps.length}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-sm text-gray-500">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] max-w-full overflow-hidden">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="product-slug"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                rows={2}
                placeholder="Brief product description"
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
                rows={4}
                placeholder="Describe your product in detail"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="compareAtPrice">Compare At Price</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compareAtPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Product SKU"
                />
              </div>
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) =>
                    setFormData({ ...formData, barcode: e.target.value })
                  }
                  placeholder="Product barcode"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lowStockThreshold: parseInt(e.target.value) || 5,
                    })
                  }
                  placeholder="5"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="trackQuantity"
                checked={formData.trackQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, trackQuantity: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="trackQuantity">Track Quantity</Label>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Product Video
            </h3>

            {/* Video Section */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="video-upload"
                  className="text-sm font-medium text-gray-700"
                >
                  Product Video
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload a video file (MP4, WebM, QuickTime) - Max 100MB
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("video-upload")?.click()
                    }
                    disabled={uploading}
                    className="flex items-center space-x-2"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                    <span>{uploading ? "Uploading..." : "Upload Video"}</span>
                  </Button>
                  {formData.video && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">
                        Video uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Preview */}
              {formData.video && (
                <div className="mt-4">
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                      <video
                        src={formData.video}
                        controls
                        className="w-full h-full object-cover"
                        onError={() => console.log("Video failed to load")}
                      >
                        Your browser does not support the video tag.
                      </video>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Video Preview
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Product Images
            </h3>

            {/* Images Section */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="image-upload"
                  className="text-sm font-medium text-gray-700"
                >
                  Product Images
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload image files (JPEG, PNG, WebP) - Max 10MB each
                </p>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    disabled={uploading}
                    className="flex items-center space-x-2"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                    <span>{uploading ? "Uploading..." : "Upload Images"}</span>
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formData.images.length} image(s) uploaded
                    </span>
                    {formData.images.length > 0 && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Images ready
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Image Previews ({formData.images.length} images)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-full">
                    {formData.images.map((imageUrl, index) => {
                      console.log(`Rendering image ${index}:`, imageUrl);
                      return (
                        <div
                          key={index}
                          className="relative group bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          {/* Copy the exact same approach as Simple Image Test */}
                          <div className="aspect-square flex items-center justify-center bg-gray-200">
                            <Image
                              src={imageUrl}
                              width={100}
                              height={100}
                              alt={`Product image ${index + 1}`}
                              className="w-20 h-20 object-cover border rounded"
                              unoptimized={true}
                            />
                          </div>
                          {/* Position label */}
                          <div className="absolute top-1 left-1">
                            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              {index === 0 ? "Main" : index + 1}
                            </div>
                          </div>

                          {/* Remove button */}
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {formData.images.length > 8 && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      ⚠️ Consider using fewer images for better performance
                    </p>
                  )}
                </div>
              )}

              {/* Image Upload Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">💡</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Image Tips
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use high-quality images (at least 800x800px)</li>
                      <li>• Supported formats: JPG, PNG, WebP</li>
                      <li>• First image will be the main product image</li>
                      <li>• Recommended: 3-5 images per product</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Product Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  placeholder="L x W x H"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag),
                  })
                }
                placeholder="leather, handmade, premium"
              />
            </div>

            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    features: e.target.value
                      .split("\n")
                      .filter((feature) => feature.trim()),
                  })
                }
                rows={3}
                placeholder="Handcrafted leather&#10;Premium quality&#10;Durable construction"
              />
            </div>

            <div>
              <Label htmlFor="materials">Materials (one per line)</Label>
              <Textarea
                id="materials"
                value={formData.materials.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    materials: e.target.value
                      .split("\n")
                      .filter((material) => material.trim()),
                  })
                }
                rows={3}
                placeholder="Italian leather&#10;Brass hardware&#10;Cotton lining"
              />
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              SEO & Settings
            </h3>

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="SEO title for search engines"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                rows={2}
                placeholder="SEO description for search engines"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Product["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 max-w-full overflow-hidden">
          {/* Left Side - Previous & Cancel */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Previous</span>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              Cancel
            </Button>
          </div>

          {/* Right Side - Next/Submit */}
          <div className="w-full sm:w-auto">
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => onSave(formData)}
                disabled={saving}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{product ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{product ? "Update Product" : "Create Product"}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
