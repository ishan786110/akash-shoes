import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">


        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
          {/* Company info */}
          <div className="lg:max-w-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground text-primary rounded flex items-center justify-center">
                <span className="font-bold text-lg">AS</span>
              </div>
              <span className="text-xl font-bold">Aakash Shoes</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Your trusted local footwear store, now serving customers worldwide. Quality shoes for every step of your journey.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/AKASHSHOES" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-primary-foreground/10">
                  <Facebook className="w-5 h-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/akash_shoes_halvad/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-primary-foreground/10">
                  <Instagram className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/men" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Men's Shoes
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Women's Shoes
                </Link>
              </li>
              <li>
                <Link to="/kids" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Kids' Shoes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>



          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-3">
            <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-foreground/80 flex-shrink-0 mt-0.5" />
                <a 
                  href="https://share.google/VRqWqqLazm9EGdyVt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 text-sm hover:text-primary-foreground hover:underline transition-colors"
                >
                  Aakash shoes - Halvad
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  +91 9913897086
                </span>
              </div>

            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;