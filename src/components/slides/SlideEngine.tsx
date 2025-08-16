import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { useSlidePreload } from '@/hooks/useSlidePreload';
import { CommandSlide } from './slide-types/CommandSlide';
import { VisualSlide } from './slide-types/VisualSlide';
import { InstructionSlide } from './slide-types/InstructionSlide';
import { InteractiveSlide } from './slide-types/InteractiveSlide';
import { CheckpointSlide } from './slide-types/CheckpointSlide';
import { FinalSlide } from './slide-types/FinalSlide';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideEngineProps {
  slides: ModuleSlide[];
  onSlideChange?: (index: number, slide: ModuleSlide) => void;
  onSlideComplete?: (slide: ModuleSlide, index: number) => void;
  onSubmission?: (data: any) => void;
  className?: string;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export const SlideEngine: React.FC<SlideEngineProps> = ({
  slides,
  onSlideChange,
  onSlideComplete,
  onSubmission,
  className,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
    skipSnaps: false,
    dragFree: false,
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoAdvance);
  const autoplayTimerRef = useRef<NodeJS.Timeout>();
  
  const { isImageLoaded, preloadImage } = useSlidePreload(slides, currentIndex);

  const updateScrollState = useCallback((embla: UseEmblaCarouselType[1]) => {
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  const onSelect = useCallback((embla: UseEmblaCarouselType[1]) => {
    const index = embla.selectedScrollSnap();
    setCurrentIndex(index);
    
    const slide = slides[index];
    if (slide) {
      onSlideChange?.(index, slide);
      
      // Auto-complete non-interactive slides after viewing
      if (slide.type !== 'interactive') {
        setTimeout(() => {
          onSlideComplete?.(slide, index);
        }, 1000);
      }
    }
    
    updateScrollState(embla);
  }, [slides, onSlideChange, onSlideComplete, updateScrollState]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  // Setup Embla event listeners
  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', updateScrollState);
    emblaApi.on('select', onSelect);
    emblaApi.on('settle', () => updateScrollState(emblaApi));

    return () => {
      emblaApi.off('reInit', updateScrollState);
      emblaApi.off('select', onSelect);
      emblaApi.off('settle', () => updateScrollState(emblaApi));
    };
  }, [emblaApi, onSelect, updateScrollState]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          scrollPrev();
          break;
        case 'ArrowDown':
          event.preventDefault();
          scrollNext();
          break;
        case ' ':
          event.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'Home':
          event.preventDefault();
          scrollTo(0);
          break;
        case 'End':
          event.preventDefault();
          scrollTo(slides.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext, scrollTo, slides.length]);

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying || !canScrollNext) return;

    const currentSlide = slides[currentIndex];
    if (currentSlide?.type === 'interactive') return; // Don't auto-advance on interactive slides

    autoplayTimerRef.current = setTimeout(() => {
      scrollNext();
    }, autoAdvanceDelay);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [isPlaying, canScrollNext, currentIndex, slides, scrollNext, autoAdvanceDelay]);

  const handleSubmission = (data: any) => {
    const currentSlide = slides[currentIndex];
    if (currentSlide) {
      onSlideComplete?.(currentSlide, currentIndex);
      onSubmission?.(data);
      
      // Auto-advance to next slide after interactive submission
      setTimeout(() => {
        if (canScrollNext) {
          scrollNext();
        }
      }, 1000);
    }
  };

  const renderSlideContent = (slide: ModuleSlide, index: number) => {
    switch (slide.type) {
      case 'command':
        return <CommandSlide slide={slide} />;
      case 'visual':
        return <VisualSlide slide={slide} />;
      case 'instruction':
        return <InstructionSlide slide={slide} />;
      case 'interactive':
        return (
          <InteractiveSlide 
            slide={slide} 
            onSubmission={handleSubmission}
          />
        );
      case 'checkpoint':
        return (
          <CheckpointSlide 
            slide={slide} 
            currentIndex={index} 
            totalSlides={slides.length} 
          />
        );
      case 'final':
        return <FinalSlide slide={slide} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Unknown slide type: {slide.type}</p>
          </div>
        );
    }
  };

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No slides available</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Main Slide Viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex flex-col h-full">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-h-full">
              <div className="w-full h-full">
                {renderSlideContent(slide, index)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {autoAdvance && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 w-8 p-0 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 z-40">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      </div>
    </div>
  );
};