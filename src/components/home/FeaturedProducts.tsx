import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import productOxfordShoes from "@/assets/product-oxford-shoes.jpg";
import productRunningSneakers from "@/assets/product-running-sneakers.jpg";
import productWomensHeels from "@/assets/product-womens-heels.jpg";
import productWorkBoots from "@/assets/product-work-boots.jpg";
import productCanvasSneakers from "@/assets/product-canvas-sneakers.jpg";
import productKidsShoes from "@/assets/product-kids-shoes.jpg";

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
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-rating text-rating"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

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
          {featuredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-card-hover border-0 bg-card"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.brand}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-sale text-white px-3 py-1 rounded-full text-xs font-medium">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white"
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

                  {/* Add to cart overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="lg">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-muted-foreground">{product.brand}</span>
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-price">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;