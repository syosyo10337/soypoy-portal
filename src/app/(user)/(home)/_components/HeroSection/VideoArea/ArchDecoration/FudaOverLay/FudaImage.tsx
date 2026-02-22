import Image, { type StaticImageData } from "next/image";
import { cn } from "@/utils/cn";

interface FudaImageProps {
  src: StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function FudaImage({
  src,
  alt,
  className,
  priority = false,
}: FudaImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("h-auto", className)}
      quality={85}
      priority={priority}
    />
  );
}
