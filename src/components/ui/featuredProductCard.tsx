import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "./badge";

export const FeaturedProductCard = ({
    product,
    index,
    favorites,
    toggleFavorite,
    handleOrder,
    renderStars,
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
    const price = product.discountPrice ?? product.originalPrice;
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

                        {/* Favorite */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white z-20"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product.id);
                            }}
                        >
                            <Heart
                                className={`w-4 h-4 ${favorites.includes(product.id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-600"
                                    }`}
                            />
                        </Button>

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
