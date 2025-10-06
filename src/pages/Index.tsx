import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import RevampedHeader from '@/components/landing/RevampedHeader';
import HeroRevamp from '@/components/landing/HeroRevamp';
import SocialProofSection from '@/components/landing/SocialProofSection';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import LearningPreview from '@/components/landing/LearningPreview';
import { FieldManualPreview } from '@/components/landing/FieldManualPreview';
import ProcessRoadmap from '@/components/landing/ProcessRoadmap';
import EnhancedFAQSection from '@/components/landing/EnhancedFAQSection';
import ConversionCTA from '@/components/landing/ConversionCTA';
import StickyConversionBar from '@/components/landing/StickyConversionBar';
import FooterSection from '@/components/FooterSection';
import InvestorModal from '@/components/InvestorModal';
import SubscriptionModal from '@/components/SubscriptionModal';

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolledToTrigger, setHasScrolledToTrigger] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { checkSubscription } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    // Handle subscription redirect
    const subscription = searchParams.get('subscription');
    if (subscription === 'success') {
      toast({
        title: "Subscription Successful",
        description: "Welcome to MAGAT University! You now have full access to all content.",
        variant: "default",
      });
      checkSubscription(); // Refresh subscription status
      // Clear URL params
      window.history.replaceState({}, '', '/');
    } else if (subscription === 'cancelled') {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription was cancelled. You can try again anytime.",
        variant: "destructive",
      });
      setShowSubscriptionModal(true);
      // Clear URL params
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams, toast, checkSubscription]);

  useEffect(() => {
    const handleScroll = () => {
      if (hasScrolledToTrigger) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage >= 0.66) {
        setShowModal(true);
        setHasScrolledToTrigger(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledToTrigger]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      <RevampedHeader />
      <main className="relative z-10 flex-1">
        <HeroRevamp />
        <SocialProofSection />
        <FeaturesShowcase />
        <LearningPreview />
        <FieldManualPreview />
        <ProcessRoadmap />
        <EnhancedFAQSection />
        <ConversionCTA />
      </main>
      <FooterSection />
      <StickyConversionBar />
      <InvestorModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default Index;
