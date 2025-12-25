// components/admin/AddProductDialog.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Firebase (only database needed now)
import { ref as dbRef, push, set, update } from "firebase/database";
import { db } from "@/firebase";

// Cloudinary upload helper
const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = "dico29syt";
  const uploadPreset = "shoesimages";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
};

interface Product {
  id?: string;
  name: string;
  brand?: string | null;
  category: string;
  description?: string | null;
  originalPrice: number;
  discountPrice?: number | null;
  stock: number;
  rating: number;
  isOnSale: boolean;
  isNew: boolean;
  imageUrl: string;
}

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess?: () => void;
}

const categories = [
  "Formal",
  "Athletic",
  "Boots",
  "Women",
  "Men",
  "Kids",
  "Casual",
];

const AddProductDialog = ({
  open,
  onOpenChange,
  product,
  onSuccess,
}: AddProductDialogProps) => {
  const isEditMode = !!product;

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    rating: 0,
    isOnSale: false,
    isNew: false,
    image: null as File | null,
    currentImageUrl: "",
    removeImage: false, // New flag to track if user wants to remove current image
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      setFormData({
        name: product.name,
        brand: product.brand || "",
        category: product.category,
        description: product.description || "",
        originalPrice: product.originalPrice.toString(),
        discountPrice: product.discountPrice ? product.discountPrice.toString() : "",
        stock: product.stock.toString(),
        rating: product.rating,
        isOnSale: product.isOnSale,
        isNew: product.isNew,
        image: null,
        currentImageUrl: product.imageUrl,
        removeImage: false,
      });
      setImagePreview(product.imageUrl);
    } else if (open && !product) {
      setFormData({
        name: "",
        brand: "",
        category: "",
        description: "",
        originalPrice: "",
        discountPrice: "",
        stock: "",
        rating: 0,
        isOnSale: false,
        isNew: false,
        image: null,
        currentImageUrl: "",
        removeImage: false,
      });
      setImagePreview(null);
    }
  }, [open, product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file, removeImage: false });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null, removeImage: true });
    setImagePreview(null);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => setFormData({ ...formData, rating: starValue })}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform duration-xs hover:scale-110"
        >
          <Star
            size={24}
            className={cn(
              "transition-colors duration-xs",
              (hoverRating || formData.rating) >= starValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.originalPrice) {
      alert("Please fill all required fields.");
      return;
    }

    if (!formData.image && !formData.currentImageUrl && !formData.removeImage) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = formData.currentImageUrl;

      // If user uploaded a new image → upload to Cloudinary
      if (formData.image) {
        finalImageUrl = await uploadToCloudinary(formData.image);
      }

      // If user clicked "remove image" → clear imageUrl
      if (formData.removeImage) {
        finalImageUrl = "";
      }

      const productData = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || null,
        category: formData.category.toLowerCase(),
        description: formData.description.trim() || null,
        originalPrice: Number(formData.originalPrice),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock) || 0,
        rating: formData.rating,
        isOnSale: formData.isOnSale,
        isNew: formData.isNew,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && product?.id) {
        const productRef = dbRef(db, `products/${product.id}`);
        await update(productRef, productData);
      } else {
        const productsRef = dbRef(db, "products");
        const newProductRef = push(productsRef);
        await set(newProductRef, { ...productData, createdAt: new Date().toISOString() });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image *</Label>
            <div className="flex items-start gap-4 flex-wrap">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-sm">
                  <Upload size={24} className="text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Rest of the form remains unchanged */}
          {/* Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Classic Oxford Leather Shoes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand Name</Label>
              <Input
                id="brand"
                placeholder="Premium Line"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                placeholder="100"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="159.99"
                  min="0"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  required
                  className="pl-7 bg-background"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPrice">Discount Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="discountPrice"
                  type="number"
                  placeholder="129.99"
                  min="0"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className="pl-7 bg-background"
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Product Rating</Label>
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating > 0 ? `${formData.rating}.0` : "Not rated"}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOnSale"
                checked={formData.isOnSale}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isOnSale: checked as boolean })
                }
              />
              <Label htmlFor="isOnSale" className="cursor-pointer flex items-center gap-2">
                <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                  Sale
                </span>
                Mark as On Sale
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isNew: checked as boolean })
                }
              />
              <Label htmlFor="isNew" className="cursor-pointer flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  New
                </span>
                Mark as New Arrival
              </Label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;