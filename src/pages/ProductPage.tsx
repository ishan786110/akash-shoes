import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/utils";
import { Star, Share2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AnimatedShoeLoader } from "@/components/ui/AnimatedShoeLoader";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({
            id: docSnap.id,
            ...docSnap.data(),
          } as Product);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOrder = () => {
    if (!product) return;

    const price = product.discountPrice ?? product.originalPrice;

    // Current product page URL
    const productLink = window.location.href;

    const message = `Hello Aakash Shoes, I want to buy:
Product: ${product.name}
Price: ₹${price}
Product Link: ${productLink}`;

    const whatsappUrl = `https://wa.me/919913897086?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out ${product?.name} at Aakash Shoes!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!");
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "fill-rating text-rating"
            : "text-muted-foreground"
        }`}
      />
    ));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow flex items-center justify-center">
          <AnimatedShoeLoader text="Loading product details..." />
        </main>

        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">
            Product not found.
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  const price = product.discountPrice ?? product.originalPrice;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Product Image */}
            <div className="rounded-lg overflow-hidden bg-muted/20 border flex items-center justify-center relative">

              {product.isNew && (
                <Badge className="absolute top-4 left-4 z-10">
                  New
                </Badge>
              )}

              {product.isOnSale && (
                <Badge
                  variant="destructive"
                  className="absolute top-4 left-16 z-10"
                >
                  Sale
                </Badge>
              )}

              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-cover max-h-[600px]"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col space-y-6">

              {/* Brand & Name */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  {product.brand}
                </p>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating || 5)}
                  </div>

                  <span className="text-sm text-muted-foreground">
                    ({product.rating || 5} Rating)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">
                  ₹{price}
                </span>

                {product.discountPrice && (
                  <span className="text-2xl line-through text-muted-foreground">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  Description
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">

                {/* Buy Now */}
                <Button
                  size="lg"
                  className="flex-1 text-lg h-14"
                  onClick={handleOrder}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>

                {/* Share */}
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;