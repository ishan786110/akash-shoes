import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, ShoppingCart, Filter, Grid, List } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

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
  sizes: string[];
  colors: string[];
}

const ShopPage = () => {
  const { category } = useParams();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Mock product data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Classic Oxford Leather Shoes",
      brand: "Premium Line",
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg",
      category: "formal",
      isSale: true,
      sizes: ["8", "9", "10", "11", "12"],
      colors: ["Black", "Brown"]
    },
    {
      id: 2,
      name: "Athletic Running Sneakers",
      brand: "SportTech",
      price: 89.99,
      rating: 4.6,
      reviews: 89,
      image: "/placeholder.svg",
      category: "athletic",
      isNew: true,
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["White", "Black", "Blue"]
    },
    {
      id: 3,
      name: "Women's Elegant Heels",
      brand: "Elegance",
      price: 95.99,
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.svg",
      category: "women",
      sizes: ["6", "7", "8", "9", "10"],
      colors: ["Black", "Red", "Nude"]
    },
    {
      id: 4,
      name: "Rugged Work Boots",
      brand: "ToughWear",
      price: 149.99,
      rating: 4.9,
      reviews: 203,
      image: "/placeholder.svg",
      category: "boots",
      sizes: ["8", "9", "10", "11", "12", "13"],
      colors: ["Brown", "Black"]
    },
    {
      id: 5,
      name: "Casual Canvas Sneakers",
      brand: "StreetStyle",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 78,
      image: "/placeholder.svg",
      category: "men",
      isSale: true,
      sizes: ["8", "9", "10", "11"],
      colors: ["White", "Navy", "Gray"]
    },
    {
      id: 6,
      name: "Kids Adventure Shoes",
      brand: "Little Steps",
      price: 49.99,
      rating: 4.8,
      reviews: 92,
      image: "/placeholder.svg",
      category: "kids",
      isNew: true,
      sizes: ["1", "2", "3", "4", "5"],
      colors: ["Blue", "Pink", "Green"]
    },
    {
      id: 7,
      name: "Hiking Boots",
      brand: "TrailMaster",
      price: 179.99,
      rating: 4.7,
      reviews: 145,
      image: "/placeholder.svg",
      category: "boots",
      sizes: ["8", "9", "10", "11", "12"],
      colors: ["Brown", "Green", "Black"]
    },
    {
      id: 8,
      name: "Business Loafers",
      brand: "Executive",
      price: 110.99,
      rating: 4.6,
      reviews: 87,
      image: "/placeholder.svg",
      category: "formal",
      sizes: ["8", "9", "10", "11", "12"],
      colors: ["Black", "Brown"]
    }
  ];

  // Filter products based on category
  const filteredProducts = category && category !== 'all' 
    ? allProducts.filter(product => product.category === category)
    : allProducts;

  const getCategoryTitle = (cat?: string) => {
    switch (cat) {
      case 'men': return "Men's Shoes";
      case 'women': return "Women's Shoes";
      case 'kids': return "Kids' Shoes";
      case 'athletic': return "Athletic Shoes";
      case 'formal': return "Formal Shoes";
      case 'boots': return "Boots & Work Shoes";
      default: return "All Shoes";
    }
  };

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
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero/Category Header */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{getCategoryTitle(category)}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated collection of premium footwear. 
                Quality, comfort, and style in every step.
              </p>
              <div className="mt-6">
                <Badge variant="secondary" className="text-sm">
                  {filteredProducts.length} Products Found
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Sort */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-card-hover border-0 bg-card ${
                    viewMode === 'list' ? 'flex flex-row overflow-hidden' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' 
                        ? 'w-48 h-48 flex-shrink-0' 
                        : 'rounded-t-lg'
                    }`}>
                      <img
                        src={product.image}
                        alt={`${product.name} - ${product.brand}`}
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                          viewMode === 'list' ? 'w-full h-full' : 'w-full h-64'
                        }`}
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
                      {viewMode === 'grid' && (
                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button variant="secondary" size="lg">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-price">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Additional info for list view */}
                      {viewMode === 'list' && (
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Sizes: </span>
                            <span className="text-sm text-muted-foreground">
                              {product.sizes.join(', ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Colors: </span>
                            <span className="text-sm text-muted-foreground">
                              {product.colors.join(', ')}
                            </span>
                          </div>
                          <Button className="mt-4">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load more button */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Products
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;