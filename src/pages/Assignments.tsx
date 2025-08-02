import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, Clock, AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

interface Assignment {
  id: string;
  week_number: number;
  module_number: number;
  title: string;
  description: string;
  objective: string;
  instructions: string;
  status: string;
  due_date: string;
  media_urls?: string[];
}

// ...existing code...

const Assignments: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Due Soon');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  useEffect(() => {
    const fetchAssignments = async () => {
      const { data, error } = await supabase.from('assignments').select('*');
      if (data) setAssignments(data);
    };
    fetchAssignments();
  }, []);

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

  const filteredAssignments = assignments.filter(assignment => {
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
          {/* Assignment Cards */}
          <div className="space-y-4 animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
            {filteredAssignments
              .sort((a, b) => a.week_number - b.week_number || a.module_number - b.module_number)
              .map((assignment, index) => (
                <Card key={assignment.id} className="institutional-card hover:scale-105 transition-all duration-300 hover:shadow-xl" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                  <CardContent className="p-4 cursor-pointer" onClick={() => setSelectedAssignment(assignment)}>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Week {assignment.week_number}</span>
                        <span>Module {assignment.module_number}</span>
                        <span className="font-bold">{assignment.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{assignment.description}</div>
                      <div className="text-xs">Objective: {assignment.objective}</div>
                      <div className="text-xs">Due: {assignment.due_date}</div>
                      <div className="text-xs">Status: {assignment.status}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {/* Assignment Details Modal */}
          {selectedAssignment && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-card rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-xl font-bold mb-2">{selectedAssignment.title}</h2>
                <div className="mb-2">Week {selectedAssignment.week_number} | Module {selectedAssignment.module_number}</div>
                <div className="mb-2 text-muted-foreground">{selectedAssignment.description}</div>
                <div className="mb-2 text-sm">Objective: {selectedAssignment.objective}</div>
                <div className="mb-2 text-sm">Instructions: {selectedAssignment.instructions}</div>
                <div className="mb-2 text-sm">Due: {selectedAssignment.due_date}</div>
                {/* Media display */}
                {selectedAssignment.media_urls && selectedAssignment.media_urls.length > 0 && (
                  <div className="mb-2">
                    <div className="font-bold text-sm mb-1">Attached Media:</div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssignment.media_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="underline text-primary">Media {i+1}</a>
                      ))}
                    </div>
                  </div>
                )}
                {/* Submission Fields */}
                <div className="mt-4">
                  <label className="block mb-1 font-bold">Submit your work:</label>
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows={4}
                    value={submissionText}
                    onChange={e => setSubmissionText(e.target.value)}
                    placeholder="Enter your response..."
                  />
                  <input
                    type="file"
                    multiple
                    className="mb-2"
                    onChange={e => setMediaFiles(Array.from(e.target.files || []))}
                  />
                  <div className="flex gap-2">
                    <Button variant="default" onClick={() => {/* handle submit logic */}}>Submit</Button>
                    <Button variant="ghost" onClick={() => setSelectedAssignment(null)}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}