"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchCategories,
  getCategoryStats,
} from "@/lib/actions/fetch-categories.action";
import {
  sanityToCategories,
  SimpleCategory,
} from "@/lib/utils/sanity-to-category";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Grid, List } from "lucide-react";

interface CategoryManagerProps {
  showStats?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  viewMode?: "grid" | "list";
}

export default function CategoryManager({
  showStats = true,
  showFilters = true,
  showSearch = true,
  viewMode = "grid",
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    SimpleCategory[]
  >([]);
  const [stats, setStats] = useState<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    parentCategories: number;
    subcategories: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "sortOrder" | "created">(
    "sortOrder"
  );
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">(
    viewMode
  );

  useEffect(() => {
    loadCategories();
    loadStats();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchQuery, statusFilter, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategories = async () => {
    try {
      setLoading(true);
      const sanityCategories = await fetchCategories();
      const convertedCategories = sanityToCategories(sanityCategories);
      setCategories(convertedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const categoryStats = await getCategoryStats();
      setStats(categoryStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((category) =>
        statusFilter === "active" ? category.isActive : !category.isActive
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "sortOrder":
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        case "created":
          return 0; // Would need creation date from Sanity
        default:
          return 0;
      }
    });

    setFilteredCategories(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
  };

  const handleSort = (sort: "name" | "sortOrder" | "created") => {
    setSortBy(sort);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeCategories}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.inactiveCategories}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Parent Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.parentCategories}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Filters */}
          {showFilters && (
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sortOrder">Sort Order</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={currentViewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={currentViewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories Grid/List */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                No categories found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "No categories available"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            currentViewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              viewMode={currentViewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: SimpleCategory;
  viewMode: "grid" | "list";
}

function CategoryCard({ category, viewMode }: CategoryCardProps) {
  return (
    <Card className={viewMode === "list" ? "flex flex-row" : ""}>
      <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{category.name}</CardTitle>
            <CardDescription className="mt-1">
              {category.description || "No description"}
            </CardDescription>
          </div>
          <Badge variant={category.isActive ? "default" : "secondary"}>
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={viewMode === "list" ? "flex items-center" : ""}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Slug: {category.slug}</span>
            {category.sortOrder && <span>• Order: {category.sortOrder}</span>}
          </div>
          {category.image && (
            <div className="mt-2 relative w-full h-32">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm" variant="outline">
              View Products
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
