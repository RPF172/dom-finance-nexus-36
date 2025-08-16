import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWeekSlides } from '@/hooks/useWeekSlides';
import { SlideEngine } from '@/components/slides/SlideEngine';
import { AdminWeekSlideFAB } from '@/components/admin/AdminWeekSlideFAB';
import { useSlideProgress, useCompleteSlide } from '@/hooks/useSlideProgress';
import { useSlideSubmission } from '@/hooks/useSlideSubmission';
import { useFinalizeModule } from '@/hooks/useFinalizeModule';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { ModuleSlide } from '@/hooks/useModuleSlides';

export const EnhancedWeekSlideExperience: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showIntro, setShowIntro] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<string>>(new Set());

  const { data: weeks, isLoading: weeksLoading } = useWeekSlides();
  const { data: slideProgress } = useSlideProgress(weekId || '');
  const { mutate: completeSlide } = useCompleteSlide();
  const { mutate: submitSlide } = useSlideSubmission();
  const { mutate: finalizeModule } = useFinalizeModule();

  const currentWeek = weeks?.find(w => w.id === weekId);
  const allSlides = currentWeek?.modules.flatMap(m => m.slides) || [];
  const moduleIds = currentWeek?.modules.map(m => m.id) || [];

  // Calculate progress based on completed slides
  const completedCount = slideProgress?.filter(p => p.completed).length || 0;
  const progressPercentage = allSlides.length > 0 ? (completedCount / allSlides.length) * 100 : 0;

  // Hide intro animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Update completed slides from progress data
  useEffect(() => {
    if (slideProgress) {
      const completed = new Set(
        slideProgress.filter(p => p.completed).map(p => p.slide_id)
      );
      setCompletedSlides(completed);
    }
  }, [slideProgress]);

  const handleSlideChange = (index: number, slide: ModuleSlide) => {
    setCurrentSlideIndex(index);
  };

  const handleSlideComplete = (slide: ModuleSlide, index: number) => {
    completeSlide({
      moduleId: slide.module_id,
      slideId: slide.id,
    });
    
    setCompletedSlides(prev => new Set([...prev, slide.id]));

    // Check if this is the last slide
    if (index === allSlides.length - 1) {
      // Finalize all modules after a short delay
      setTimeout(() => {
        moduleIds.forEach(moduleId => {
          finalizeModule(moduleId);
        });
        
        // Show completion message but don't auto-navigate
        toast({
          title: "Week Completed!",
          description: `Congratulations! You've completed ${currentWeek?.title || 'this week'}.`,
        });
      }, 1500);
    }
  };

  const handleSubmission = (data: any) => {
    submitSlide({
      moduleId: data.moduleId,
      slideId: data.slideId,
      textResponse: data.textResponse,
      mediaFile: data.mediaFile,
      metadata: data.metadata,
    });
  };

  const handleBack = () => {
    navigate('/learn');
  };

  const handleHome = () => {
    navigate('/');
  };

  if (weeksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentWeek || allSlides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold mb-4">Week Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This week doesn't have any slide content available yet.
          </p>
          <div className="flex space-x-3 justify-center">
            <Button onClick={handleBack} variant="outline">
              Back to Learning
            </Button>
            <Button onClick={handleHome}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </Card>
      </div>
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
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 bg-background flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
              />
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-institutional font-bold text-foreground mb-2"
              >
                {currentWeek.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground"
              >
                Preparing your enhanced experience...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Week {currentWeek.week_number}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {currentSlideIndex + 1} / {allSlides.length}
            </div>
            <div className="w-32">
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="text-sm font-medium">
              {Math.round(progressPercentage)}%
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleHome}
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="absolute inset-0 pt-[73px]">
        <SlideEngine
          slides={allSlides}
          onSlideChange={handleSlideChange}
          onSlideComplete={handleSlideComplete}
          onSubmission={handleSubmission}
          autoAdvance={false}
          className="w-full h-full"
        />
      </div>

      {/* Admin FAB */}
      <AdminWeekSlideFAB 
        currentModuleId={allSlides[currentSlideIndex]?.module_id} 
      />
    </div>
  );
};