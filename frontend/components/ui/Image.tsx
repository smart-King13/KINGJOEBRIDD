"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "./Skeleton";

interface ImageProps extends Omit<NextImageProps, "onLoad"> {
  aspectRatio?: "square" | "portrait" | "landscape" | "editorial" | "auto";
  hoverZoom?: boolean;
}

export function Image({ className, aspectRatio = "auto", hoverZoom, alt, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    editorial: "aspect-[4/5]",
    auto: "aspect-auto",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-muted",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {!isLoaded && <Skeleton className="absolute inset-0 z-10" />}
      <NextImage
        className={cn(
          "object-cover motion-safe-transition duration-700",
          hoverZoom && "hover:scale-105",
          !isLoaded ? "opacity-0 blur-sm" : "opacity-100 blur-0"
        )}
        onLoad={() => setIsLoaded(true)}
        alt={alt}
        {...props}
      />
    </div>
  );
}
