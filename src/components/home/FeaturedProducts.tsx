import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import productOxfordShoes from "@/assets/product-oxford-shoes.jpg";
import productRunningSneakers from "@/assets/product-running-sneakers.jpg";
import productWomensHeels from "@/assets/product-womens-heels.jpg";
import productWorkBoots from "@/assets/product-work-boots.jpg";
import productCanvasSneakers from "@/assets/product-canvas-sneakers.jpg";
import productKidsShoes from "@/assets/product-kids-shoes.jpg";
// 🔥 Firestore
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { FeaturedProductCard } from "../ui/featuredProductCard";
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  //buy 
  const handleOrder = (product) => {
    const message = `Hello Aakash Shoes, I want to buy: ${product.name} - ₹${product.price}`;
    const whatsappUrl = `https://wa.me/919913897086?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Mock product data
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Classic Oxford Leather Shoes",
      brand: "Premium Line",
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.8,
      reviews: 124,
      image: productOxfordShoes,
      category: "Formal",
      isSale: true
    },
    {
      id: 2,
      name: "Athletic Running Sneakers",
      brand: "SportTech",
      price: 89.99,
      rating: 4.6,
      reviews: 89,
      image: productRunningSneakers,
      category: "Athletic",
      isNew: true
    },
    {
      id: 3,
      name: "Women's Elegant Heels",
      brand: "Elegance",
      price: 95.99,
      rating: 4.7,
      reviews: 156,
      image: productWomensHeels,
      category: "Women"
    },
    {
      id: 4,
      name: "Rugged Work Boots",
      brand: "ToughWear",
      price: 149.99,
      rating: 4.9,
      reviews: 203,
      image: productWorkBoots,
      category: "Boots"
    },
    {
      id: 5,
      name: "Casual Canvas Sneakers",
      brand: "StreetStyle",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 78,
      image: productCanvasSneakers,
      category: "Casual",
      isSale: true
    },
    {
      id: 6,
      name: "Kids Adventure Shoes",
      brand: "Little Steps",
      price: 49.99,
      rating: 4.8,
      reviews: 92,
      image: productKidsShoes,
      category: "Kids",
      isNew: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating)
          ? "fill-rating text-rating"
          : "text-muted-foreground"
          }`}
      />
    ));
  };

  // 🔥 Fetch products from Firestore (READ ONLY)
  useEffect(() => {
    const q = query(collection(db, "products"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const products: Product[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Product),
        }));
        setAllProducts(products);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore fetch error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and highly-rated shoes, carefully selected for quality,
            comfort, and style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {allProducts
            .slice(0, 6)
            .map((product, index) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                index={index}
                handleOrder={handleOrder}
                renderStars={renderStars}
              />
            ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="transition-all duration-sm ease-elastic hover:scale-105"
            onClick={() => navigate("/shop")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;