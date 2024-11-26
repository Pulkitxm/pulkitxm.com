import { useState, useEffect } from "react";

export function usePrefetchImages(images: string[]) {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    const preloadImage = (src: string) =>
      new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = reject;
      });

    Promise.all(images.map(preloadImage))
      .then(setLoadedImages)
      .catch((error) => console.error("Error preloading images:", error));
  }, [images]);

  return loadedImages;
}
