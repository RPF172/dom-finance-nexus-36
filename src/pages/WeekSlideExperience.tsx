import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWeekSlides } from '@/hooks/useWeekSlides';
import { EnhancedWeekSlideExperience } from './EnhancedWeekSlideExperience';
import { SideProgressBar } from '@/components/slides/SideProgressBar';
import { AdminWeekSlideFAB } from '@/components/admin/AdminWeekSlideFAB';
import { useSlideProgress, useCompleteSlide } from '@/hooks/useSlideProgress';
import { useSlideSubmission } from '@/hooks/useSlideSubmission';
import { useFinalizeModule } from '@/hooks/useFinalizeModule';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const WeekSlideExperience: React.FC = () => {
  // Redirect to enhanced experience
  return <EnhancedWeekSlideExperience />;
};