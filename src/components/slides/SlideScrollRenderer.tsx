import React, { useEffect, useRef, useState } from 'react';
import { ModuleSlide } from '@/hooks/useModuleSlides';
import { CommandSlide } from './slide-types/CommandSlide';
import { VisualSlide } from './slide-types/VisualSlide';
import { InstructionSlide } from './slide-types/InstructionSlide';
import { InteractiveSlide } from './slide-types/InteractiveSlide';
import { CheckpointSlide } from './slide-types/CheckpointSlide';
import { FinalSlide } from './slide-types/FinalSlide';
import { useCompleteSlide } from '@/hooks/useSlideProgress';
import { useFinalizeModule } from '@/hooks/useFinalizeModule';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface SlideScrollRendererProps {
  slides: ModuleSlide[];
  moduleIds: string[];
  onSubmission?: (data: any) => void;
  weekTitle?: string;
}

export const SlideScrollRenderer: React.FC<SlideScrollRendererProps> = ({
  slides,
  moduleIds,
  onSubmission,
  weekTitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [viewedSlides, setViewedSlides] = useState<Set<string>>(new Set());
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { mutate: completeSlide } = useCompleteSlide();
  const { mutate: finalizeModule } = useFinalizeModule();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Track which slides have been viewed via intersection observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            const slideId = entry.target.getAttribute('data-slide-id');
            const slideIndex = parseInt(entry.target.getAttribute('data-slide-index') || '0');
            
            if (slideId) {
              setActiveSlideIndex(slideIndex);
              
              // Mark non-interactive slides as viewed after 1 second
              const slide = slides.find(s => s.id === slideId);
              if (slide && slide.type !== 'interactive') {
                setTimeout(() => {
                  setViewedSlides(prev => {
                    if (!prev.has(slideId)) {
                      // Mark slide as complete
                      completeSlide({
                        moduleId: slide.module_id,
                        slideId: slide.id,
                      });
                      return new Set([...prev, slideId]);
                    }
                    return prev;
                  });
                }, 1000);
              }
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.7,
      }
    );

    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [slides, completeSlide]);

  // Handle finalization when last slide is viewed
  useEffect(() => {
    const lastSlide = slides[slides.length - 1];
    if (lastSlide && viewedSlides.has(lastSlide.id)) {
      // Finalize all modules in this week
      moduleIds.forEach(moduleId => {
        finalizeModule(moduleId);
      });
      
      // Navigate back to learning hub after a short delay
      setTimeout(() => {
        toast({
          title: "Week Completed!",
          description: `You've completed ${weekTitle || 'this week'}. Great work!`,
        });
        navigate('/learn');
      }, 2000);
    }
  }, [viewedSlides, slides, moduleIds, finalizeModule, navigate, toast, weekTitle]);

  const handleSubmission = (data: any) => {
    const activeSlide = slides[activeSlideIndex];
    if (activeSlide) {
      // Mark interactive slide as complete when submitted
      completeSlide({
        moduleId: activeSlide.module_id,
        slideId: activeSlide.id,
      });
      
      setViewedSlides(prev => new Set([...prev, activeSlide.id]));
    }
    
    onSubmission?.(data);
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
        return <div>Unknown slide type</div>;
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto snap-y snap-mandatory"
      style={{ scrollBehavior: 'smooth' }}
    >
      {slides.map((slide, index) => (
        <section
          key={slide.id}
          ref={(el) => {
            if (el) {
              slideRefs.current.set(slide.id, el as HTMLDivElement);
            }
          }}
          data-slide-id={slide.id}
          data-slide-index={index}
          className="min-h-screen w-full snap-start flex items-center justify-center relative"
        >
          {renderSlideContent(slide, index)}
        </section>
      ))}
    </div>
  );
};