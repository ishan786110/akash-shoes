import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Award, Heart, Truck } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From humble beginnings in a small town to serving customers worldwide, 
              StepForward has been crafting quality footwear experiences for over 25 years.
            </p>
          </div>
        </section>

        {/* Main story section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
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
              <div className="relative">
                <img
                  src="/placeholder.svg"
                  alt="Our original store front from 1999"
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg">
                  <div className="text-2xl font-bold">25+</div>
                  <div className="text-sm">Years of Service</div>
                </div>
              </div>
            </div>

            {/* Values section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardContent className="p-8">
                  <Heart className="w-12 h-12 text-price mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                  <p className="text-muted-foreground">
                    Every decision we make starts with one question: how does this benefit our customers?
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-8">
                  <Award className="w-12 h-12 text-price mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Quality Promise</h3>
                  <p className="text-muted-foreground">
                    We carefully select every product in our store, ensuring it meets our high standards.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-8">
                  <Users className="w-12 h-12 text-price mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
                  <p className="text-muted-foreground">
                    We believe in giving back to the communities that have supported us throughout our journey.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stats section */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-12 mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Impact Today</h2>
                <p className="text-primary-foreground/80 text-lg">
                  These numbers represent real people, real relationships, and real satisfaction.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">10,000+</div>
                  <div className="text-primary-foreground/80">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-primary-foreground/80">Shoe Styles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-primary-foreground/80">Trusted Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">25+</div>
                  <div className="text-primary-foreground/80">Countries Served</div>
                </div>
              </div>
            </div>

            {/* What sets us apart */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">What Sets Us Apart</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're not just another online shoe store. We're your trusted partner in finding the perfect footwear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Local Expertise, Global Reach</h3>
                  <p className="text-muted-foreground text-sm">
                    We bring the personal touch of a local store to customers worldwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">25 Years of Experience</h3>
                  <p className="text-muted-foreground text-sm">
                    Our expertise comes from decades of helping customers find their perfect fit.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Fast & Reliable Shipping</h3>
                  <p className="text-muted-foreground text-sm">
                    Quick delivery with careful packaging to ensure your shoes arrive in perfect condition.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA section */}
            <div className="text-center bg-muted/30 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Step Forward?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have found their perfect shoes with us. 
                Experience the StepForward difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Shop Our Collection
                </Button>
                <Button size="lg" variant="outline">
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