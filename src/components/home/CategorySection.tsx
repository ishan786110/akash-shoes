import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import categoryMen from "@/assets/category-men.jpg";
import categoryWomen from "@/assets/category-women.jpg";
import categoryAthletic from "@/assets/category-athletic.jpg";
import categoryBoots from "@/assets/category-boots.jpg";
import categoryKids from "@/assets/category-kids.jpg";
import categoryFormal from "@/assets/category-formal.jpg";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

const CategorySection = () => {
  const categories: Category[] = [
    {
      id: "men",
      name: "Men's Collection",
      description: "Professional and casual footwear for every occasion",
      image: categoryMen,
      productCount: 127,
      featured: true
    },
    {
      id: "women",
      name: "Women's Collection", 
      description: "Elegant styles from casual to sophisticated",
      image: categoryWomen,
      productCount: 156,
      featured: true
    },
    {
      id: "athletic",
      name: "Athletic & Sports",
      description: "Performance footwear for active lifestyles",
      image: categoryAthletic,
      productCount: 89,
      featured: false
    },
    {
      id: "boots",
      name: "Boots & Work Shoes",
      description: "Durable protection meets timeless style",
      image: categoryBoots,
      productCount: 76,
      featured: false
    },
    {
      id: "kids",
      name: "Kids & Youth",
      description: "Growing feet deserve the best comfort and quality",
      image: categoryKids,
      productCount: 94,
      featured: false
    },
    {
      id: "formal",
      name: "Formal & Business",
      description: "Make the right impression with professional footwear",
      image: categoryFormal,
      productCount: 68,
      featured: false
    }
  ];

  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect pair for every style, occasion, and adventure. 
            Our curated collections ensure quality and comfort in every step.
          </p>
        </div>

        {/* Featured categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredCategories.map((category) => (
            <Card key={category.id} className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-80">
                  <img
                    src={category.image}
                    alt={`${category.name} footwear collection`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-primary-foreground">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-primary-foreground/90 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-foreground/80">
                        {category.productCount} Products
                      </span>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regular categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regularCategories.map((category) => (
            <Card key={category.id} className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-36 md:h-48">
                  <img
                    src={category.image}
                    alt={`${category.name} footwear collection`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  
                  <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 text-primary-foreground">
                    <h4 className="font-semibold mb-1 text-sm md:text-base">{category.name}</h4>
                    <span className="text-xs text-primary-foreground/80">
                      {category.productCount} items
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="text-center mt-12">
          <Button size="lg" className="px-8">
            Explore All Categories
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;