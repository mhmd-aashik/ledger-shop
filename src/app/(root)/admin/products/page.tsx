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
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  images: string[];
  video?: string;
  thumbnail?: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  tags: string[];
  features: string[];
  materials: string[];
  dimensions?: string;
  weight?: number;
  metaTitle?: string;
  metaDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK";
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600">
            Manage your product catalog ({filteredProducts.length} products)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            A list of all products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={product.images[0] || "/placeholder-product.jpg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.sku && `SKU: ${product.sku}`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">${product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{product.quantity}</span>
                      {product.trackQuantity &&
                        product.quantity <= product.lowStockThreshold && (
                          <Badge variant="destructive" className="text-xs">
                            Low Stock
                          </Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "PUBLISHED"
                          ? "default"
                          : product.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {product.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}

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
  const totalSteps = 5;

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

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        return !!(
          formData.name &&
          formData.slug &&
          formData.description &&
          formData.categoryId
        );
      case 2: // Pricing & Inventory
        return !!(formData.price > 0);
      case 3: // Media
        return formData.images.length >= 2;
      case 4: // Additional Details
        return true; // Optional step
      case 5: // SEO & Settings
        return true; // Optional step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum image requirement
    if (formData.images.length < 2) {
      toast.error("At least 2 product images are required");
      return;
    }

    onSave(formData);
  };

  // Upload functions
  const processFile = async (
    file: File,
    type: "image" | "video" | "thumbnail"
  ) => {
    // Validate file type
    if (type === "image" || type === "thumbnail") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
    } else if (type === "video") {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
    }

    // Validate file size
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `File size must be less than ${type === "video" ? "50MB" : "10MB"}`
      );
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
      uploadFormData.append("type", type);

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const { url } = await response.json();
        console.log("File uploaded successfully:", url);

        if (type === "image") {
          setFormData({ ...formData, images: [...formData.images, url] });
        } else if (type === "video") {
          setFormData({ ...formData, video: url });
        } else if (type === "thumbnail") {
          setFormData({ ...formData, thumbnail: url });
        }

        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
        toast.success("File uploaded successfully");
      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if adding this image would exceed the maximum of 4
    if (formData.images.length >= 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    await processFile(file, "image");
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file, "video");
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file, "thumbnail");
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
      // Check if adding this image would exceed the maximum of 4
      if (formData.images.length >= 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }

      await processFile(e.dataTransfer.files[0], "image");
    }
  };

  const removeImage = (index: number) => {
    // Check if removing this image would go below the minimum of 2
    if (formData.images.length <= 2) {
      toast.error("Minimum 2 images required");
      return;
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
              <p className="text-sm text-gray-600">
                Tell us about your product
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-500 mt-1">
                  This will be used in the product URL
                </p>
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

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                rows={2}
                placeholder="Brief product summary"
              />
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Inventory */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Pricing & Inventory
              </h3>
              <p className="text-sm text-gray-600">
                Set your product pricing and stock levels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
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
                <Label htmlFor="compareAtPrice">Compare at Price</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compareAtPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Original price to show discount
                </p>
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input
                  id="costPrice"
                  type="number"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Initial Quantity</Label>
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
                <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
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
              <Label htmlFor="trackQuantity">
                Track inventory for this product
              </Label>
            </div>
          </div>
        )}

        {/* Step 3: Media */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Media
              </h3>
              <p className="text-sm text-gray-600">
                Add images and videos to showcase your product
              </p>
            </div>

            {/* Product Images */}
            <div>
              <div className="flex items-center justify-between">
                <Label>Product Images *</Label>
                <span className="text-sm text-gray-500">
                  {formData.images.length}/4 (Minimum: 2, Maximum: 4)
                </span>
              </div>
              <div className="mt-2">
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    formData.images.length >= 4
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={
                    formData.images.length < 4 ? handleDrag : undefined
                  }
                  onDragLeave={
                    formData.images.length < 4 ? handleDrag : undefined
                  }
                  onDragOver={
                    formData.images.length < 4 ? handleDrag : undefined
                  }
                  onDrop={formData.images.length < 4 ? handleDrop : undefined}
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={formData.images.length >= 4}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center space-y-2 ${
                      formData.images.length >= 4
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="text-gray-500">
                      {uploading ? (
                        <div className="flex flex-col items-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <p>Uploading... {uploadProgress}%</p>
                        </div>
                      ) : formData.images.length >= 4 ? (
                        <>
                          <p className="text-gray-400">
                            Maximum 4 images reached
                          </p>
                          <p className="text-sm text-gray-400">
                            Remove an image to add a new one
                          </p>
                        </>
                      ) : (
                        <>
                          <p>Drag and drop images here, or click to select</p>
                          <p className="text-sm text-gray-400">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {formData.images.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {formData.images.length <= 2 && (
                          <div className="absolute top-2 right-2 bg-gray-500 text-white rounded-full p-1 opacity-75">
                            <span className="text-xs">Min</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <Label htmlFor="video-upload">Product Video</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.video && (
                  <div className="mt-2">
                    <video
                      src={formData.video}
                      controls
                      className="w-full max-w-md rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <Label htmlFor="thumbnail-upload">Thumbnail Image</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.thumbnail && (
                  <div className="mt-2">
                    <Image
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      width={200}
                      height={200}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Additional Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Details
              </h3>
              <p className="text-sm text-gray-600">
                Add product specifications and features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="PROD-001"
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
                  placeholder="123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div>
              <Label htmlFor="materials">Materials</Label>
              <Input
                id="materials"
                value={formData.materials.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    materials: e.target.value
                      .split(",")
                      .map((m) => m.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Leather, Metal, Wood"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple materials with commas
              </p>
            </div>

            <div>
              <Label htmlFor="features">Features</Label>
              <Input
                id="features"
                value={formData.features.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    features: e.target.value
                      .split(",")
                      .map((f) => f.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Waterproof, Durable, Lightweight"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple features with commas
              </p>
            </div>
          </div>
        )}

        {/* Step 5: SEO & Settings */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                SEO & Settings
              </h3>
              <p className="text-sm text-gray-600">
                Configure SEO and product settings
              </p>
            </div>

            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="SEO optimized title"
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
                rows={3}
                placeholder="SEO optimized description"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
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

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving || !isStepValid(currentStep)}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {product ? "Updating..." : "Creating..."}
                  </>
                ) : product ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
