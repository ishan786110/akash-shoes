import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-footwear.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium footwear collection featuring elegant shoes and boots"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-2xl text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Step Into 
            <span className="block text-secondary">Excellence</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            From our small town roots to global reach - discover premium footwear 
            that combines traditional craftsmanship with modern style. Every step tells a story.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="hero" className="text-lg px-8 py-3">
              Shop Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Our Story
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold mb-1">25+</div>
              <div className="text-sm text-primary-foreground/80">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">10K+</div>
              <div className="text-sm text-primary-foreground/80">Happy Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">500+</div>
              <div className="text-sm text-primary-foreground/80">Shoe Styles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -mb-16 -ml-16" />
      <div className="absolute top-20 right-20 w-16 h-16 bg-accent/30 rounded-full" />
    </section>
  );
};

export default HeroSection;