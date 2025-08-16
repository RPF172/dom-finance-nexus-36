import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWeekSlides } from '@/hooks/useWeekSlides';
import { SlideScrollRenderer } from '@/components/slides/SlideScrollRenderer';
import { SideProgressBar } from '@/components/slides/SideProgressBar';
import { AdminWeekSlideFAB } from '@/components/admin/AdminWeekSlideFAB';
import { useSlideProgress, useCompleteSlide } from '@/hooks/useSlideProgress';
import { useSlideSubmission } from '@/hooks/useSlideSubmission';
import { useFinalizeModule } from '@/hooks/useFinalizeModule';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const WeekSlideExperience: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  const { data: weeks, isLoading: weeksLoading } = useWeekSlides();
  const { data: slideProgress } = useSlideProgress(weekId || '');
  const { mutate: submitSlide } = useSlideSubmission();

  const currentWeek = weeks?.find(w => w.id === weekId);
  const allSlides = currentWeek?.modules.flatMap(m => m.slides) || [];
  const moduleIds = currentWeek?.modules.map(m => m.id) || [];

  // Calculate progress
  const completedSlides = slideProgress?.filter(p => p.completed).length || 0;
  const progressPercentage = allSlides.length > 0 ? (completedSlides / allSlides.length) * 100 : 0;

  // Hide intro animation
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
          <Button onClick={handleBack}>Return to Learning</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Intro Animation */}
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute inset-0 z-50 bg-background flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-institutional font-bold text-foreground">
              {currentWeek.title}
            </h2>
            <p className="text-muted-foreground mt-2">Preparing your experience...</p>
          </motion.div>
        </motion.div>
      )}

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="absolute top-4 left-4 z-40 bg-background/80 backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Progress Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Week {currentWeek.week_number}</span>
          <Progress value={progressPercentage} className="w-32" />
           <span className="text-muted-foreground">
             1/{allSlides.length}
           </span>
        </div>
      </div>

      {/* Side Progress Bar */}
      <SideProgressBar
        currentSlide={1}
        totalSlides={allSlides.length}
      />

      {/* Scroll-based Slide Content */}
      <div className="absolute inset-0 pt-16">
        <SlideScrollRenderer
          slides={allSlides}
          moduleIds={moduleIds}
          onSubmission={handleSubmission}
          weekTitle={currentWeek?.title}
        />
      </div>

      {/* Admin FAB */}
      <AdminWeekSlideFAB currentModuleId={allSlides[0]?.module_id} />
    </div>
  );
};