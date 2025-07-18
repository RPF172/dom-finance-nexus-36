import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, Clock, AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

interface Assignment {
  id: string;
  title: string;
  type: 'Ritual Submission' | 'Reflection' | 'Audio-Visual Ritual';
  status: 'incomplete' | 'in_progress' | 'missed' | 'completed';
  dueIn: string;
  hasPunishment?: boolean;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Submit a photo kneeling naked',
    type: 'Ritual Submission',
    status: 'incomplete',
    dueIn: '12h'
  },
  {
    id: '2', 
    title: 'Write 300 words on humiliation',
    type: 'Reflection',
    status: 'in_progress',
    dueIn: '3d'
  },
  {
    id: '3',
    title: 'Video: Recite mantra 3x',
    type: 'Audio-Visual Ritual', 
    status: 'missed',
    dueIn: 'Overdue',
    hasPunishment: true
  }
];

const Assignments: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Due Soon');

  const getStatusIcon = (assignment: Assignment) => {
    switch (assignment.type) {
      case 'Ritual Submission':
        return <Upload className="w-4 h-4" />;
      case 'Reflection':
        return <FileText className="w-4 h-4" />;
      case 'Audio-Visual Ritual':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'incomplete':
        return <Badge variant="secondary">Incomplete</Badge>;
      case 'in_progress':
        return <Badge variant="outline">In Progress</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed ❌</Badge>;
      case 'completed':
        return <Badge variant="default">Complete</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getActionButtons = (assignment: Assignment) => {
    if (assignment.status === 'missed' && assignment.hasPunishment) {
      return (
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full bg-red-900/50 hover:bg-red-900/70 border-red-700"
        >
          VIEW PUNISHMENT DETAILS
        </Button>
      );
    }

    if (assignment.status === 'in_progress') {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            SUBMIT TEXT
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            SAVE DRAFT
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          UPLOAD FILE
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          MARK COMPLETE
        </Button>
      </div>
    );
  };

  const filteredAssignments = mockAssignments.filter(assignment => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return assignment.status === 'in_progress';
    if (filter === 'Missed') return assignment.status === 'missed';
    if (filter === 'Done') return assignment.status === 'completed';
    return true;
  });

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 text-xl font-institutional tracking-wider uppercase">
                  <div className="w-6 h-6 bg-accent animate-pulse"></div>
                  ASSIGNMENTS
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Rank: INITIATE WHELP
                </div>
                <div className="w-32 bg-muted h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-accent h-1 rounded-full w-2/3 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Tasks Remaining</div>
                <div className="text-3xl font-bold text-destructive animate-pulse">3</div>
                <div className="text-xs text-destructive mt-1">URGENT</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-2 overflow-x-auto">
              {['All', 'In Progress', 'Missed', 'Done'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className="whitespace-nowrap institutional-button"
                >
                  {filterOption}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border rounded px-2 py-1 text-sm"
              >
                <option>Due Soon</option>
                <option>Type</option>
                <option>Status</option>
              </select>
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="space-y-4 animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
            {filteredAssignments.map((assignment, index) => (
              <Card key={assignment.id} className={`institutional-card hover:scale-105 transition-all duration-300 hover:shadow-xl ${
                assignment.status === 'missed' ? 'border-l-4 border-l-destructive bg-gradient-to-r from-card to-destructive/5' :
                assignment.status === 'in_progress' ? 'border-l-4 border-l-accent bg-gradient-to-r from-card to-accent/5' :
                assignment.status === 'completed' ? 'border-l-4 border-l-green-500 bg-gradient-to-r from-card to-green-500/5' :
                'border-l-4 border-l-muted'
              }`} style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {getStatusIcon(assignment)}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">
                        Task: "{assignment.title}"
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>Type: {assignment.type}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        {getStatusBadge(assignment.status)}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Due In: {assignment.dueIn}
                          {assignment.status === 'missed' && (
                            <AlertTriangle className="w-3 h-3 text-destructive ml-1" />
                          )}
                        </div>
                      </div>
                      {assignment.hasPunishment && (
                        <div className="text-xs text-destructive mb-3 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Assigned Punishment: Yes
                        </div>
                      )}
                      {getActionButtons(assignment)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Assignments;