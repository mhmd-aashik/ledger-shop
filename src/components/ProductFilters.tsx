"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const categories = ["All", "Wallets", "Cardholders", "Accessories"];
const genders = ["All", "Men", "Women", "Unisex"];
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [gender, setGender] = useState(searchParams.get("gender") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("minPrice") || "0") || 0,
    parseInt(searchParams.get("maxPrice") || "2000") || 2000,
  ]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when filters change
  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category !== "All") params.set("category", category);
    if (gender !== "All") params.set("gender", gender);
    if (sortBy !== "default") params.set("sort", sortBy);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 2000) params.set("maxPrice", priceRange[1].toString());

    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, category, gender, sortBy, priceRange, router]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setGender("All");
    setSortBy("default");
    setPriceRange([0, 2000]);
    router.push("/products");
  };

  const activeFiltersCount = [
    debouncedSearch,
    category !== "All",
    gender !== "All",
    sortBy !== "default",
    priceRange[0] > 0 || priceRange[1] < 2000,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4" />
          <Input
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 h-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
          />
        </div>
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800 px-2 py-1 text-xs"
            >
              {activeFiltersCount} applied
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1 h-8 text-sm"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Grid Layout Filters */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[250px] h-6 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="hover:bg-orange-50"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[250px] h-6 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gen) => (
                  <SelectItem
                    key={gen}
                    value={gen}
                    className="hover:bg-orange-50"
                  >
                    {gen}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[250px] h-6 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-orange-50"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="w-[120px] h-9 text-sm border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 2000,
                  ])
                }
                className="w-[120px] h-9 text-sm border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Price Slider - Full Width */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex flex-wrap gap-2">
            {debouncedSearch && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
              >
                Search: &ldquo;{debouncedSearch}&rdquo;
                <X
                  className="h-3 w-3 cursor-pointer hover:text-orange-900"
                  onClick={() => setSearch("")}
                />
              </Badge>
            )}
            {category !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
              >
                {category}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-orange-900"
                  onClick={() => setCategory("All")}
                />
              </Badge>
            )}
            {gender !== "All" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
              >
                {gender}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-orange-900"
                  onClick={() => setGender("All")}
                />
              </Badge>
            )}
            {sortBy !== "default" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
              >
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-orange-900"
                  onClick={() => setSortBy("default")}
                />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
              >
                ${priceRange[0]} - ${priceRange[1]}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-orange-900"
                  onClick={() => setPriceRange([0, 2000])}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
