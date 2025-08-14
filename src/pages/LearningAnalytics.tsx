import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { LearningAnalyticsDashboard } from '@/components/learning/LearningAnalyticsDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, BarChart3, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LearningAnalytics() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/learn" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Learning
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Learning Analytics
              </h1>
              <p className="text-muted-foreground">
                Insights into your learning journey and progress patterns
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <LearningAnalyticsDashboard />

        {/* Learning Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Learning Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Optimal Session Length</h4>
                <p className="text-sm text-muted-foreground">
                  Research shows 25-45 minute focused sessions with 5-10 minute breaks 
                  maximize retention and comprehension.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Focus Score Improvement</h4>
                <p className="text-sm text-muted-foreground">
                  Eliminate distractions, use noise-canceling headphones, and 
                  practice the Pomodoro technique to improve focus scores.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Consistency is Key</h4>
                <p className="text-sm text-muted-foreground">
                  Daily 20-minute sessions are more effective than weekly 
                  2-hour cramming sessions for long-term retention.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Active Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Complete practice tasks and assignments promptly after reading 
                  content to reinforce learning through application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}