import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeekData } from '@/hooks/useWeeks';
import AppLayout from '@/components/layout/AppLayout';
import { Flame } from 'lucide-react';

const TABS = [
  { key: 'content', label: 'Content Read' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'assignment', label: 'Assignment' },
  { key: 'review', label: 'Review' },
];

const WeekView: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const { data: week, isLoading } = useWeekData(weekId!);
  const [activeTab, setActiveTab] = useState('content');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Flame className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground mt-4">Loading week...</p>
        </div>
      </AppLayout>
    );
  }

  if (!week) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Week not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-xs text-muted-foreground mb-2">WEEK {week.week_number}</div>
          <h1 className="text-3xl font-bold mb-2">{week.title}</h1>
          <p className="text-muted-foreground mb-4">{week.description || week.objective}</p>
        </div>

        {/* 2x2 Quadrant Tabs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`rounded-lg border p-6 text-center font-semibold transition-all ${activeTab === tab.key ? 'bg-primary text-white border-primary' : 'bg-card text-foreground border-border hover:bg-accent/10'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Viewer */}
        <div className="rounded-lg border bg-card p-6 min-h-[200px]">
          {activeTab === 'content' && (
            <div>
              <h2 className="font-bold mb-2">Content Read</h2>
              {/* Render week.modules or content here */}
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{JSON.stringify(week.modules, null, 2)}</pre>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div>
              <h2 className="font-bold mb-2">Tasks</h2>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{JSON.stringify(week.tasks, null, 2)}</pre>
            </div>
          )}
          {activeTab === 'assignment' && (
            <div>
              <h2 className="font-bold mb-2">Assignment</h2>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{JSON.stringify(week.assignments, null, 2)}</pre>
            </div>
          )}
          {activeTab === 'review' && (
            <div>
              <h2 className="font-bold mb-2">Review</h2>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{JSON.stringify(week.review_steps, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default WeekView;
