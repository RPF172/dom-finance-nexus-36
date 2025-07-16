import React, { useState } from 'react';
import { Lock, Play, CheckCircle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Scripture {
  id: string;
  title: string;
  status: 'locked' | 'in_progress' | 'complete';
  description: string;
  progress?: number;
  unlockRequirement?: string;
  unlockCost?: number;
}

const scriptureData: Scripture[] = [
  {
    id: 'scripture-1',
    title: 'SCRIPTURE I: OBEDIENCE',
    status: 'in_progress',
    description: 'You must unlearn the lie of will.',
    progress: 40,
  },
  {
    id: 'scripture-2',
    title: 'SCRIPTURE II: STILLNESS',
    status: 'locked',
    description: 'The body must be still. The mind must beg.',
    unlockRequirement: 'Complete Scripture I: Obedience',
  },
  {
    id: 'scripture-3',
    title: 'SCRIPTURE III: TRIBUTE',
    status: 'locked',
    description: 'Give, and be relieved of false power.',
    unlockCost: 5,
  },
  {
    id: 'scripture-4',
    title: 'SCRIPTURE IV: REPETITION',
    status: 'locked',
    description: 'Pleasure is not progress. Repetition is.',
    unlockRequirement: 'Remain worthless until summoned',
  },
  {
    id: 'scripture-5',
    title: 'SCRIPTURE V: HIERARCHY',
    status: 'locked',
    description: 'Ranks do not elevate. They degrade with precision.',
    unlockRequirement: 'Complete previous scriptures',
  },
  {
    id: 'scripture-6',
    title: 'SCRIPTURE VI: PUNISHMENT',
    status: 'locked',
    description: 'Punishment is not cruelty. It is clarification.',
    unlockRequirement: 'Submit to institutional processing',
  },
];

const DoctrineReader = () => {
  const completedScriptures = scriptureData.filter(s => s.status === 'complete').length;
  const totalScriptures = scriptureData.length;

  const getStatusIcon = (status: Scripture['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-amber-500" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (scripture: Scripture) => {
    switch (scripture.status) {
      case 'complete':
        return '✓ Complete';
      case 'in_progress':
        return `🔓 In Progress (${scripture.progress}%)`;
      case 'locked':
        return '🔒 Locked';
    }
  };

  const getActionButton = (scripture: Scripture) => {
    switch (scripture.status) {
      case 'complete':
        return (
          <Button variant="outline" size="sm" className="w-full bg-emerald-950/30 border-emerald-800 text-emerald-400 hover:bg-emerald-900/50">
            REVIEW
          </Button>
        );
      case 'in_progress':
        return (
          <Button size="sm" className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-mono">
            CONTINUE
          </Button>
        );
      case 'locked':
        if (scripture.unlockCost) {
          return (
            <Button variant="outline" size="sm" className="w-full border-muted-foreground/30 text-muted-foreground hover:bg-muted/20">
              PAY ${scripture.unlockCost} TO UNLOCK
            </Button>
          );
        }
        return (
          <Button variant="outline" size="sm" className="w-full border-muted-foreground/30 text-muted-foreground hover:bg-muted/20">
            UNLOCK REQUIREMENT
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b border-muted">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Flame className="h-6 w-6 text-accent" />
            THE DOCTRINE
          </div>
          <div className="text-sm text-muted-foreground">
            Rank: INITIATE WHELP
          </div>
          <div className="text-sm text-muted-foreground">
            Progress: {completedScriptures} / {totalScriptures} Scriptures Claimed
          </div>
        </div>

        {/* Scripture Cards */}
        <div className="space-y-4">
          {scriptureData.map((scripture) => (
            <Card 
              key={scripture.id} 
              className={`bg-card border-muted transition-all duration-200 ${
                scripture.status === 'locked' 
                  ? 'opacity-75 hover:opacity-90' 
                  : 'hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-accent flex-shrink-0" />
                    <h3 className="font-bold text-sm leading-tight">
                      {scripture.title}
                    </h3>
                  </div>
                  {getStatusIcon(scripture.status)}
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  "{scripture.description}"
                </p>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Status: {getStatusText(scripture)}
                  </span>
                  {scripture.status === 'in_progress' && scripture.progress && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-300"
                          style={{ width: `${scripture.progress}%` }}
                        />
                      </div>
                      <span className="text-accent">{scripture.progress}%</span>
                    </div>
                  )}
                </div>

                {scripture.unlockRequirement && scripture.status === 'locked' && (
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-muted">
                    Requires: {scripture.unlockRequirement}
                  </div>
                )}

                {getActionButton(scripture)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Footer */}
        <div className="text-center space-y-2 pt-6 border-t border-muted">
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-emerald-400">
              🔓 Completed: {completedScriptures}
            </span>
            <span className="text-muted-foreground">
              🔒 Locked: {totalScriptures - completedScriptures}
            </span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            📖 Scroll to reveal deeper indoctrination
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-muted">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex justify-around text-xs">
              <button className="flex flex-col items-center gap-1 text-accent">
                <Flame className="h-4 w-4" />
                <span>Doctrine</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">🧷</span>
                <span>Assignments</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">🏛️</span>
                <span>Pledgehall</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">💸</span>
                <span>Tribute</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
                <span className="h-4 w-4 flex items-center justify-center">☰</span>
                <span>More</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctrineReader;