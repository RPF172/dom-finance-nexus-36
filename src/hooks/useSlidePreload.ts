import { useEffect, useRef } from 'react';
import { ModuleSlide } from './useModuleSlides';

interface UseSlidePreloadOptions {
  preloadDistance?: number; // How many slides ahead to preload
  maxConcurrentLoads?: number; // Max simultaneous image loads
}

export const useSlidePreload = (
  slides: ModuleSlide[],
  currentIndex: number,
  options: UseSlidePreloadOptions = {}
) => {
  const { preloadDistance = 2, maxConcurrentLoads = 3 } = options;
  const loadingQueue = useRef<Set<string>>(new Set());
  const loadedImages = useRef<Set<string>>(new Set());
  const loadingPromises = useRef<Map<string, Promise<void>>>(new Map());

  const preloadImage = async (url: string): Promise<void> => {
    if (loadedImages.current.has(url) || loadingQueue.current.has(url)) {
      return loadingPromises.current.get(url) || Promise.resolve();
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        loadedImages.current.add(url);
        loadingQueue.current.delete(url);
        loadingPromises.current.delete(url);
        resolve();
      };
      
      img.onerror = () => {
        loadingQueue.current.delete(url);
        loadingPromises.current.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });

    loadingQueue.current.add(url);
    loadingPromises.current.set(url, promise);
    
    return promise;
  };

  const preloadSlides = async () => {
    const slidesToPreload: string[] = [];
    
    // Collect URLs from upcoming slides
    for (let i = currentIndex; i <= Math.min(currentIndex + preloadDistance, slides.length - 1); i++) {
      const slide = slides[i];
      if (slide?.media_url && !loadedImages.current.has(slide.media_url)) {
        slidesToPreload.push(slide.media_url);
      }
    }

    // Limit concurrent loads
    const currentLoads = Array.from(loadingQueue.current).length;
    const availableSlots = maxConcurrentLoads - currentLoads;
    const urlsToLoad = slidesToPreload.slice(0, availableSlots);

    // Start preloading
    const promises = urlsToLoad.map(url => 
      preloadImage(url).catch(error => {
        console.warn('Failed to preload slide image:', error);
      })
    );

    await Promise.allSettled(promises);
  };

  useEffect(() => {
    preloadSlides();
  }, [currentIndex, slides]);

  // Cleanup old preloaded images to prevent memory leaks
  useEffect(() => {
    const cleanup = () => {
      const maxRetainedImages = 10;
      if (loadedImages.current.size > maxRetainedImages) {
        const urlsToRemove = Array.from(loadedImages.current).slice(0, loadedImages.current.size - maxRetainedImages);
        urlsToRemove.forEach(url => loadedImages.current.delete(url));
      }
    };

    const interval = setInterval(cleanup, 30000); // Cleanup every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    isImageLoaded: (url: string) => loadedImages.current.has(url),
    isImageLoading: (url: string) => loadingQueue.current.has(url),
    preloadImage,
  };
};