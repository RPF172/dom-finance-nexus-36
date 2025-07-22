import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChapter } from '@/hooks/useChapters';
import { ChapterReader } from '@/components/ChapterReader';
import AppLayout from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';

export const ChapterView = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { data: chapter, isLoading, error } = useChapter(chapterId!);

  const handleBack = () => {
    navigate('/doctrine');
  };

  const handleContinue = () => {
    // Navigate back to book reader - user can select next content
    navigate('/doctrine');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !chapter) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Chapter Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The chapter you're looking for doesn't exist or isn't published yet.
          </p>
          <button 
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Return to Book
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ChapterReader
        chapter={chapter}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    </AppLayout>
  );
};