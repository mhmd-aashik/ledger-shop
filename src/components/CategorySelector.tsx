"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchActiveCategories } from "@/lib/actions/fetch-categories.action";
import {
  sanityToCategories,
  SimpleCategory,
} from "@/lib/utils/sanity-to-category";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
  showImage?: boolean;
  showDescription?: boolean;
}

export default function CategorySelector({
  value,
  onChange,
  multiple = false,
  placeholder = "Select category...",
  className,
  showImage = false,
  showDescription = false,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const sanityCategories = await fetchActiveCategories();
      const convertedCategories = sanityToCategories(sanityCategories);
      setCategories(convertedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (categoryId: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(categoryId)
        ? currentValues.filter((id) => id !== categoryId)
        : [...currentValues, categoryId];
      onChange(newValues);
    } else {
      onChange(categoryId);
      setOpen(false);
    }
  };

  const getSelectedCategories = () => {
    if (!value) return [];
    const ids = Array.isArray(value) ? value : [value];
    return categories.filter((cat) => ids.includes(cat.id));
  };

  const selectedCategories = getSelectedCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (multiple) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={
                  Array.isArray(value) ? value.includes(category.id) : false
                }
                onCheckedChange={() => handleSelect(category.id)}
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                {showImage && category.image && (
                  <div className="relative w-6 h-6">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                )}
                <span>{category.name}</span>
                {showDescription && category.description && (
                  <span className="text-muted-foreground text-xs">
                    - {category.description}
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Category</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategories.length > 0
              ? selectedCategories[0].name
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => handleSelect(category.id)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.some((cat) => cat.id === category.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {showImage && category.image && (
                    <div className="relative w-6 h-6">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    {showDescription && category.description && (
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
