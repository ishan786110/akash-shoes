import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Share2, ShoppingCart, Link, MessageCircle, Facebook, Twitter, Mail } from "lucide-react";
import { Badge } from "./badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { toast } from "@/hooks/use-toast";

export const FeaturedProductCard = ({
    product,
    index,
    handleOrder,
    renderStars,
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
    const price = product.discountPrice ?? product.originalPrice;

    const getProductUrl = () => {
        return `${window.location.origin}/shop/${product.id}`;
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getProductUrl());
        toast({
            title: "Link copied!",
            description: "Product link has been copied to clipboard.",
        });
    };

    const handleShareWhatsApp = () => {
        const message = `Check out this product: ${product.name} - ₹${price}\n${getProductUrl()}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    };

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductUrl())}`, "_blank");
    };

    const handleShareTwitter = () => {
        const text = `Check out ${product.name} - ₹${price}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getProductUrl())}`, "_blank");
    };

    const handleShareEmail = () => {
        const subject = `Check out this product: ${product.name}`;
        const body = `I found this amazing product!\n\n${product.name} - ₹${price}\n\n${getProductUrl()}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };
    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-md ease-primary",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: `${index * 60}ms` }}
        >
            <Card
                key={product.id}
                className="group transition-all duration-300 hover:shadow-lg hover:bg-card-hover border-0 bg-card"
            >
                <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2 z-20">
                            {product.isNew && (
                                <Badge>New</Badge>
                            )}
                            {product.isOnSale && (
                                <Badge variant="destructive">
                                    Sale
                                </Badge>
                            )}
                        </div>

                        {/* Share Button */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-4 right-4 bg-white/80 hover:bg-white z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Share2 className="w-4 h-4 text-gray-600" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                                    <Link className="w-4 h-4 mr-2" />
                                    Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleShareWhatsApp} className="cursor-pointer">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Share to WhatsApp
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleShareFacebook} className="cursor-pointer">
                                    <Facebook className="w-4 h-4 mr-2" />
                                    Share to Facebook
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleShareTwitter} className="cursor-pointer">
                                    <Twitter className="w-4 h-4 mr-2" />
                                    Share to Twitter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleShareEmail} className="cursor-pointer">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Share via Email
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Buy Overlay */}
                        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() =>
                                    handleOrder(product)
                                }
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Buy
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-muted-foreground">
                            {product.brand}
                        </p>
                        <h3 className="font-semibold text-lg">
                            {product.name}
                        </h3>

                        <div className="flex items-center gap-2 my-2">
                            {renderStars(product.rating)}
                            <span className="text-sm text-muted-foreground">
                                {product.rating}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">
                                ₹{price}
                            </span>
                            {product.discountPrice && (
                                <span className="line-through text-muted-foreground">
                                    ₹{product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
