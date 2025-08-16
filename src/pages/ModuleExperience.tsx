import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModuleSlides } from '@/hooks/useModuleSlides';
import { useSlideProgress, useCompleteSlide } from '@/hooks/useSlideProgress';
import { useSlideSubmission } from '@/hooks/useSlideSubmission';
import { useFinalizeModule } from '@/hooks/useFinalizeModule';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { SideProgressBar } from '@/components/slides/SideProgressBar';
import { OBEYButton } from '@/components/slides/OBEYButton';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';

const ModuleExperience = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [canProceed, setCanProceed] = useState(false);
  const [hasSubmittedInteractive, setHasSubmittedInteractive] = useState(false);
  
  const { data: slides, isLoading: slidesLoading } = useModuleSlides(moduleId || '');
  const { data: progress } = useSlideProgress(moduleId || '');
  const completeSlide = useCompleteSlide();
  const slideSubmission = useSlideSubmission();
  const finalizeModule = useFinalizeModule();

  const currentSlide = slides?.[currentSlideIndex];
  const estimatedTimeLeft = slides ? Math.ceil((slides.length - currentSlideIndex) * 2.5) : 0;

  // Initialize slide position based on progress
  useEffect(() => {
    if (slides && progress) {
      const completedSlideIds = new Set(progress.filter(p => p.completed).map(p => p.slide_id));
      const firstIncompleteIndex = slides.findIndex(slide => !completedSlideIds.has(slide.id));
      
      if (firstIncompleteIndex !== -1) {
        setCurrentSlideIndex(firstIncompleteIndex);
      }
    }
  }, [slides, progress]);

  // Check if current slide allows proceeding
  useEffect(() => {
    if (!currentSlide) return;
    
    if (currentSlide.type === 'interactive' && currentSlide.required) {
      setCanProceed(hasSubmittedInteractive);
    } else {
      setCanProceed(true);
    }
  }, [currentSlide, hasSubmittedInteractive]);

  // Hide intro after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (canProceed) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [canProceed, currentSlideIndex]);

  const handleSubmission = useCallback(async (data: any) => {
    if (!currentSlide || !moduleId) return;
    
    try {
      await slideSubmission.mutateAsync({
        moduleId,
        slideId: currentSlide.id,
        ...data,
      });
      
      setHasSubmittedInteractive(true);
    } catch (error) {
      console.error('Submission failed:', error);
    }
  }, [currentSlide, moduleId, slideSubmission]);

  const handleNext = useCallback(async () => {
    if (!currentSlide || !moduleId || !canProceed) return;
    
    try {
      // Mark slide as completed
      await completeSlide.mutateAsync({
        moduleId,
        slideId: currentSlide.id,
      });
      
      // Move to next slide or finalize
      if (currentSlideIndex < (slides?.length || 0) - 1) {
        setCurrentSlideIndex(prev => prev + 1);
        setHasSubmittedInteractive(false);
      } else {
        // Final slide - finalize module
        await finalizeModule.mutateAsync(moduleId);
        navigate('/learn-lessons');
      }
    } catch (error) {
      console.error('Failed to proceed:', error);
    }
  }, [currentSlide, moduleId, canProceed, currentSlideIndex, slides?.length, completeSlide, finalizeModule, navigate]);

  const handleBack = () => {
    navigate('/learn-lessons');
  };

  if (slidesLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading indoctrination...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No slides found</h1>
            <p className="text-muted-foreground mb-6">This module has no slide experience configured.</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-3xl text-white font-bold">⧫</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-institutional uppercase tracking-wider text-destructive"
              >
                INDOCTRINATION PROTOCOL
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-lg text-muted-foreground mt-2"
              >
                INITIATED
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="fixed top-4 left-4 z-30 bg-background/80 backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Exit
      </Button>

      {/* Progress Bar */}
      <SideProgressBar
        currentSlide={currentSlideIndex + 1}
        totalSlides={slides.length}
        estimatedTimeLeft={estimatedTimeLeft}
      />

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        {currentSlide && !showIntro && (
          <SlideRenderer
            key={currentSlide.id}
            slide={currentSlide}
            onSubmission={handleSubmission}
            onComplete={() => finalizeModule.mutateAsync(moduleId || '')}
            currentIndex={currentSlideIndex + 1}
            totalSlides={slides.length}
          />
        )}
      </AnimatePresence>

      {/* OBEY Button */}
      {!showIntro && (
        <OBEYButton
          onClick={handleNext}
          disabled={!canProceed}
          isLoading={completeSlide.isPending || finalizeModule.isPending}
          variant={currentSlide?.type === 'final' ? 'final' : 'default'}
        />
      )}
    </div>
  );
};

export default ModuleExperience;