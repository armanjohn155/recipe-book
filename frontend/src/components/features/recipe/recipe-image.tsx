import { useState } from "react";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/cn";

type RecipeImageProps = {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  iconClassName?: string;
};

// Renders the image, but falls back to a placeholder for missing or
// broken URLs so a browser's broken-image icon or alt text never shows.
export function RecipeImage({ src, alt, className, imgClassName, iconClassName }: RecipeImageProps) {
  // Track which source failed so a corrected URL recovers automatically.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showPlaceholder = !src || failedSrc === src;

  return (
    <div className={cn("relative overflow-hidden bg-white/[0.04]", className)}>
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center text-white/40" aria-hidden="true">
          <Utensils className={cn("h-10 w-10", iconClassName)} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
