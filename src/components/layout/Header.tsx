import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3); // Mock cart count
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   // Navigation items
  const navItems = [
    { to: "/shop", label: "All Shoes", checkParent: true },
    { to: "/men", label: "Men" },
    { to: "/women", label: "Women" },
    { to: "/kids", label: "Kids" },
    { to: "/athletic", label: "Athletic" },
    { to: "/formal", label: "Formal" },
    { to: "/boots", label: "Boots" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-md ease-primary",
        isScrolled 
          ? "bg-background/98 backdrop-blur-md shadow-medium" 
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        {/* Top bar */}
        {/* <div className="flex items-center justify-between py-2 border-b border-border/40">
          <div className="text-sm text-muted-foreground">
            Free shipping on orders over $50
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link to="/track-order" className="hover:text-primary transition-colors">
              Track Order
            </Link>
            <Link to="/help" className="hover:text-primary transition-colors">
              Help
            </Link>
          </div>
        </div> */}

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AS</span>
            </div>
            <span className="text-xl font-bold">Aakash Shoes</span>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for shoes, brands, styles..."
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>

          {/* Right side actions */}
          {/* <div className="flex items-center space-x-4"> */}
          {/* Account */}
          {/* <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              Account
            </Button> */}

          {/* Cart */}
          {/* <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-price text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button> */}

           {/* Mobile menu toggle with morphing animation */}
          <Button
              variant="ghost"
              size="sm"
              className="md:hidden relative w-10 h-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-5 h-5">
                <span 
                  className={cn(
                    "absolute left-0 w-full h-0.5 bg-foreground transition-all duration-sm ease-primary",
                    isMenuOpen ? "top-1/2 rotate-45" : "top-1"
                  )}
                />
                <span 
                  className={cn(
                    "absolute left-0 top-1/2 w-full h-0.5 bg-foreground transition-all duration-xs ease-primary",
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span 
                  className={cn(
                    "absolute left-0 w-full h-0.5 bg-foreground transition-all duration-sm ease-primary",
                    isMenuOpen ? "top-1/2 -rotate-45" : "bottom-1"
                  )}
                />
              </div>
            </Button>
          {/* </div> */}
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-3 border-t border-border/40 ">
          {navItems.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium px-3 py-1 rounded-md relative group transition-colors duration-sm ease-primary",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:text-primary"
                )
              }
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-md ease-primary group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu */}
        <div 
          className={cn(
            "md:hidden overflow-hidden border-t border-border/40 transition-all duration-md ease-primary",
            isMenuOpen ? "max-h-screen py-4 opacity-100" : "max-h-0 py-0 opacity-0"
          )}
        >
            {/* Mobile search */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for shoes..."
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>

            {/* Mobile navigation */}
            <nav className="space-y-2">
              {navItems.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "block py-2 text-sm font-medium hover:text-primary transition-all duration-sm ease-primary",
                    isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                  style={{ transitionDelay: isMenuOpen ? `${index * 60}ms` : "0ms" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
      </div>
    </header>
  );
};

export default Header;