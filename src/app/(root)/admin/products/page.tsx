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
  Eye,
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

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
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

  const handleToggleActive = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !product.isActive,
        }),
      });

      if (response.ok) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          )
        );
        toast.success(
          `Product ${!product.isActive ? "activated" : "deactivated"}`
        );
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFeatured: !product.isFeatured,
        }),
      });

      if (response.ok) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
          )
        );
        toast.success(
          `Product ${!product.isFeatured ? "added to" : "removed from"} featured`
        );
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: "secondary" as const, label: "Draft" },
      PUBLISHED: { variant: "default" as const, label: "Published" },
      ARCHIVED: { variant: "outline" as const, label: "Archived" },
      OUT_OF_STOCK: { variant: "destructive" as const, label: "Out of Stock" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600">Manage your product catalog</p>
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
                  ? "Update the product details"
                  : "Create a new product"}
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
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
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Image
                              src={
                                product.images[0] || "/placeholder-product.jpg"
                              }
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.shortDescription ||
                                  product.description}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {product.isFeatured && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Featured
                                  </Badge>
                                )}
                                {!product.isActive && (
                                  <Badge variant="outline" className="text-xs">
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {product.sku || "N/A"}
                        </TableCell>
                        <TableCell>{product.category?.name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              ${product.price}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.compareAtPrice}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              product.quantity > 10
                                ? "text-green-600"
                                : product.quantity > 0
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {product.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">
                              {product.rating || 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.reviewCount || 0})
                            </span>
                          </div>
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
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(product.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                {product.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleFeatured(product.id)}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                {product.isFeatured
                                  ? "Remove from Featured"
                                  : "Add to Featured"}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="product-slug"
            required
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
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
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
          />
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
          />
        </div>
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="PROD-001"
          />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
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
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData({ ...formData, status: value as Product["status"] })
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

      {/* Media Upload Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Media</h3>

        {/* Product Images */}
        <div>
          <div className="flex items-center justify-between">
            <Label>Product Images</Label>
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
              onDragEnter={formData.images.length < 4 ? handleDrag : undefined}
              onDragLeave={formData.images.length < 4 ? handleDrag : undefined}
              onDragOver={formData.images.length < 4 ? handleDrag : undefined}
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
                      <p className="text-gray-400">Maximum 4 images reached</p>
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
                <p className="text-sm text-gray-500 mt-1">
                  Video URL: {formData.video}
                </p>
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
                <p className="text-sm text-gray-500 mt-1">
                  Thumbnail URL: {formData.thumbnail}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || formData.images.length < 2}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {product ? "Updating..." : "Creating..."}
            </>
          ) : formData.images.length < 2 ? (
            `Add Product (${formData.images.length}/2 images)`
          ) : product ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
}
