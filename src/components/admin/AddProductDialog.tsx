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

// 🔥 Firestore ONLY
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

// ---------- Cloudinary Upload ----------
const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = "dico29syt";
  const uploadPreset = "shoesimages";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.secure_url;
};

// ---------- Types ----------
export interface Product {
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess?: () => void;
}

const categories = [
  "formal",
  "athletic",
  "boots",
  "women",
  "men",
  "kids",
  "casual",
];

// ---------- Component ----------
const AddProductDialog = ({
  open,
  onOpenChange,
  product,
  onSuccess,
}: Props) => {
  const isEditMode = Boolean(product);

  const [form, setForm] = useState({
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
    removeImage: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // ---------- Populate edit mode ----------
  useEffect(() => {
    if (open && product) {
      setForm({
        name: product.name,
        brand: product.brand || "",
        category: product.category,
        description: product.description || "",
        originalPrice: product.originalPrice.toString(),
        discountPrice: product.discountPrice?.toString() || "",
        stock: product.stock.toString(),
        rating: product.rating,
        isOnSale: product.isOnSale,
        isNew: product.isNew,
        image: null,
        currentImageUrl: product.imageUrl,
        removeImage: false,
      });
      setImagePreview(product.imageUrl);
    }

    if (open && !product) {
      setForm({
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

  // ---------- Image ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm({ ...form, image: file, removeImage: false });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm({ ...form, image: null, removeImage: true });
    setImagePreview(null);
  };

  // ---------- Rating ----------
  const renderStars = () =>
    Array.from({ length: 5 }).map((_, i) => {
      const value = i + 1;
      return (
        <button
          key={i}
          type="button"
          onClick={() => setForm({ ...form, rating: value })}
          onMouseEnter={() => setHoverRating(value)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            size={22}
            className={cn(
              (hoverRating || form.rating) >= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      );
    });

  // ---------- Submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.originalPrice) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.currentImageUrl;

      if (form.image) {
        imageUrl = await uploadToCloudinary(form.image);
      }

      if (form.removeImage) {
        imageUrl = "";
      }

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        category: form.category,
        description: form.description.trim() || null,
        originalPrice: Number(form.originalPrice),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : null,
        stock: Number(form.stock) || 0,
        rating: form.rating,
        isOnSale: form.isOnSale,
        isNew: form.isNew,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode && product?.id) {
        await setDoc(doc(db, "products", product.id), payload, {
          merge: true,
        });
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert("Failed to save product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <Label>Product Image *</Label>
            <div className="flex gap-4 mt-2">
              {imagePreview ? (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer">
                  <Upload />
                  <span className="text-xs">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Name / Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                value={form.brand}
                onChange={(e) =>
                  setForm({ ...form, brand: e.target.value })
                }
              />
            </div>
          </div>

          {/* Category / Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Original Price *</Label>
              <Input
                type="number"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm({ ...form, originalPrice: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Discount Price</Label>
              <Input
                type="number"
                value={form.discountPrice}
                onChange={(e) =>
                  setForm({ ...form, discountPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">{renderStars()}</div>
          </div>

          {/* Flags */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isOnSale}
                onCheckedChange={(v) =>
                  setForm({ ...form, isOnSale: Boolean(v) })
                }
              />
              <Label>On Sale</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.isNew}
                onCheckedChange={(v) =>
                  setForm({ ...form, isNew: Boolean(v) })
                }
              />
              <Label>New Arrival</Label>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
