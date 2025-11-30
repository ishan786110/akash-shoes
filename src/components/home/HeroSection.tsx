import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-footwear.jpg";
import { SplitText } from "@/components/animations/SplitText";
import { useParallax, useMouseParallax } from "@/hooks/use-parallax";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const scrollParallax = useParallax({ speed: 0.3 });
  const mouseParallax = useMouseParallax({ speed: 0.015 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background image with parallax */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollParallax.y}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <img
          src={heroImage}
          alt="Premium footwear collection featuring elegant shoes and boots"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 z-10">
        <div 
          className="max-w-2xl text-primary-foreground"
          style={{
            transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)`,
            transition: "transform 0.3s cubic-bezier(0.22, 0.9, 0.35, 1)",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <SplitText text="Step Into" className="block" />
            <SplitText text="Excellence" className="block text-secondary" />
          </h1>
          <p 
            className={`text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed transition-all duration-lg ease-primary ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            From our small town roots to global reach - discover premium footwear 
            that combines traditional craftsmanship with modern style. Every step tells a story.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-lg ease-primary ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <Button 
              size="lg" 
              variant="hero" 
              className="text-lg px-8 py-3 group transition-all duration-sm ease-elastic hover:scale-105 hover:shadow-strong"
            >
              Shop Collection
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-sm ease-elastic group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-sm ease-primary hover:scale-105"
            >
              Our Story
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8 text-center">
            {[
              { value: "25+", label: "Years Experience", delay: 900 },
              { value: "10K+", label: "Happy Customers", delay: 1000 },
              { value: "500+", label: "Shoe Styles", delay: 1100 }
            ].map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-md ease-primary ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements with animation */}
      <div 
        className={`absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -mb-16 -ml-16 transition-all duration-xl ease-primary ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ transitionDelay: "1200ms" }}
      />
      <div 
        className={`absolute top-20 right-20 w-16 h-16 bg-accent/30 rounded-full animate-float transition-opacity duration-lg ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1400ms" }}
      />
    </section>
  );
};

export default HeroSection;