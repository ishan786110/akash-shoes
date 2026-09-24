import { Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedShoeLoaderProps {
  className?: string;
  text?: string;
}

export const AnimatedShoeLoader = ({ className, text = "Loading..." }: AnimatedShoeLoaderProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center w-full min-h-[60vh]", className)}>
      <div className="relative mb-6">
        <div className="animate-bounce">
          <Footprints className="w-16 h-16 text-primary rotate-[-45deg]" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary/20 rounded-[100%] blur-[2px] animate-pulse"></div>
      </div>
      <p className="text-muted-foreground animate-pulse text-lg font-medium">{text}</p>
    </div>
  );
};
