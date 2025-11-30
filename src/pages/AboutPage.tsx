import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Award, Heart, Truck } from "lucide-react";
import ShopImg from "@/assets/shop-img.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SplitText } from "@/components/animations/SplitText";
import { cn } from "@/lib/utils";

const AboutPage = () => {
  const heroAnimation = useScrollAnimation({ threshold: 0.2 });
  const storyAnimation = useScrollAnimation({ threshold: 0.2 });
  const valuesAnimation = useScrollAnimation({ threshold: 0.2 });
  const statsAnimation = useScrollAnimation({ threshold: 0.2 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.2 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <div ref={heroAnimation.ref} className="container mx-auto px-4 text-center">
            <SplitText 
              text="Our Story" 
              as="h1" 
              className={cn(
                "text-4xl md:text-5xl font-bold mb-6",
                heroAnimation.isVisible ? "opacity-100" : "opacity-0"
              )}
            />
            <p className={cn(
              "text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-lg ease-primary",
              heroAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "400ms" }}
            >
              From humble beginnings in a small town to serving customers worldwide, 
              StepForward has been crafting quality footwear experiences for over 25 years.
            </p>
          </div>
        </section>

        {/* Main story section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div ref={storyAnimation.ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className={cn(
                "transition-all duration-lg ease-primary",
                storyAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              )}>
                <h2 className="text-3xl font-bold mb-6">Where It All Began</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In 1999, our founder opened a small shoe store in the heart of our hometown 
                    with a simple mission: to provide quality footwear and exceptional service 
                    to our local community. What started as a family business has grown into 
                    something we never imagined.
                  </p>
                  <p>
                    For years, we served our neighbors with carefully curated selections of 
                    comfortable, durable, and stylish shoes. We got to know our customers by name, 
                    their preferences, and their stories. This personal touch became the foundation 
                    of everything we do.
                  </p>
                  <p>
                    Today, as we expand our reach globally through our online platform, we haven't 
                    forgotten our roots. Every customer interaction, every product selection, and 
                    every business decision is guided by the same values that made us successful 
                    in our small town.
                  </p>
                </div>
              </div>
              <div className={cn(
                "relative transition-all duration-lg ease-primary",
                storyAnimation.isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: "200ms" }}
              >
                <img
                  src={ShopImg}
                  alt="Our original store front from 1999"
                  className="w-full rounded-lg shadow-lg transition-transform duration-md hover:scale-105"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-strong">
                  <div className="text-2xl font-bold">25+</div>
                  <div className="text-sm">Years of Service</div>
                </div>
              </div>
            </div>

            {/* Values section */}
            <div ref={valuesAnimation.ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: Heart, title: "Customer First", description: "Every decision we make starts with one question: how does this benefit our customers?", delay: "0ms" },
                { icon: Award, title: "Quality Promise", description: "We carefully select every product in our store, ensuring it meets our high standards.", delay: "100ms" },
                { icon: Users, title: "Community Impact", description: "We believe in giving back to the communities that have supported us throughout our journey.", delay: "200ms" }
              ].map((value, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "text-center transition-all duration-lg ease-primary hover:shadow-strong hover:-translate-y-2 cursor-default",
                    valuesAnimation.isVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-12"
                  )}
                  style={{ transitionDelay: value.delay }}
                >
                  <CardContent className="p-8">
                    <value.icon className="w-12 h-12 text-price mx-auto mb-4 transition-transform duration-sm hover:scale-110" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats section */}
            <div ref={statsAnimation.ref} className={cn(
              "bg-primary text-primary-foreground rounded-2xl p-6 md:p-12 mb-16 transition-all duration-lg ease-primary",
              statsAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-12"
            )}>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Impact Today</h2>
                <p className="text-primary-foreground/80 text-base md:text-lg">
                  These numbers represent real people, real relationships, and real satisfaction.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                {[
                  { value: "10,000+", label: "Happy Customers", delay: "200ms" },
                  { value: "500+", label: "Shoe Styles", delay: "300ms" },
                  { value: "50+", label: "Trusted Brands", delay: "400ms" },
                  { value: "25+", label: "Countries Served", delay: "500ms" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "transition-all duration-lg ease-elastic",
                      statsAnimation.isVisible 
                        ? "opacity-100 translate-y-0 scale-100" 
                        : "opacity-0 translate-y-8 scale-95"
                    )}
                    style={{ transitionDelay: stat.delay }}
                  >
                    <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-primary-foreground/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* What sets us apart */}
            <div ref={featuresAnimation.ref} className={cn(
              "text-center mb-12 transition-all duration-lg ease-primary",
              featuresAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-12"
            )}>
              <h2 className="text-3xl font-bold mb-6">What Sets Us Apart</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're not just another online shoe store. We're your trusted partner in finding the perfect footwear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                { icon: MapPin, title: "Local Expertise, Global Reach", description: "We bring the personal touch of a local store to customers worldwide.", delay: "0ms" },
                { icon: Clock, title: "25 Years of Experience", description: "Our expertise comes from decades of helping customers find their perfect fit.", delay: "100ms" },
                { icon: Truck, title: "Fast & Reliable Shipping", description: "Quick delivery with careful packaging to ensure your shoes arrive in perfect condition.", delay: "200ms" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-start space-x-4 transition-all duration-lg ease-primary group hover:translate-x-2",
                    featuresAnimation.isVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-12"
                  )}
                  style={{ transitionDelay: feature.delay }}
                >
                  <div className="bg-primary/10 p-3 rounded-full transition-all duration-sm group-hover:bg-primary/20 group-hover:scale-110">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA section */}
            <div ref={ctaAnimation.ref} className={cn(
              "text-center bg-muted/30 rounded-2xl p-12 transition-all duration-lg ease-primary",
              ctaAnimation.isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-12"
            )}>
              <h2 className="text-3xl font-bold mb-4">Ready to Step Forward?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found their perfect shoes with us. 
                Experience the StepForward difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="transition-all duration-sm hover:scale-105 hover:shadow-strong">
                  Shop Our Collection
                </Button>
                <Button size="lg" variant="outline" className="transition-all duration-sm hover:scale-105">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;