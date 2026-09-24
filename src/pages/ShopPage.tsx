import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "@/lib/utils";
import { AnimatedShoeLoader } from "@/components/ui/AnimatedShoeLoader";

// 🔥 Firestore
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";

const ShopPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // WhatsApp order
  const handleOrder = (product: Product) => {
    const price = product.discountPrice ?? product.originalPrice;
    const message = `Hello Aakash Shoes, I want to buy: ${product.name} - ₹${price}`;
    const whatsappUrl = `https://wa.me/919913897086?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  
  // ✅ FIXED: Category filter (case-safe)
  const filteredProducts =
    category && category !== "all"
      ? allProducts.filter(
          (p) =>
            p.category?.toLowerCase() === category?.toLowerCase()
        )
      : allProducts;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-rating text-rating"
            : "text-muted-foreground"
        }`}
      />
    ));

  return (
    <div className="min-h-screen">
      <Header />

      <main>


        {/* Products */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <AnimatedShoeLoader text="Loading amazing shoes..." />
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => {
                  const price =
                    product.discountPrice ?? product.originalPrice;

                  return (
                    <Card
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group transition-all duration-300 hover:shadow-lg hover:bg-card-hover border-0 bg-card cursor-pointer"
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2 z-20">
                            {product.isNew && (
                              <Badge>New</Badge>
                            )}
                            {product.isOnSale && (
                              <Badge variant="destructive">
                                Sale
                              </Badge>
                            )}
                          </div>

                          {/* Favorite */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white z-20"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.includes(product.id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </Button>


                        </div>

                        <div className="p-6">
                          <p className="text-sm text-muted-foreground">
                            {product.brand}
                          </p>
                          <h3 className="font-semibold text-lg">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-2 my-2">
                            {renderStars(product.rating)}
                            <span className="text-sm text-muted-foreground">
                              {product.rating}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">
                              ₹{price}
                            </span>
                            {product.discountPrice && (
                              <span className="line-through text-muted-foreground">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <p className="text-center text-muted-foreground mt-12">
                No products found.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
