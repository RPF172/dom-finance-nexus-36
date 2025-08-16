import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, ArrowUp, ArrowDown, Link, Unlink } from 'lucide-react';
import { useWeeks } from '@/hooks/useWeeks';
import { useModules } from '@/hooks/useLessons';
import { useWeekModuleLinks, useCreateWeekModuleLink, useDeleteWeekModuleLink, useUpdateWeekModuleLinkOrder } from '@/hooks/useWeekModuleLinks';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

export const WeekModuleManager: React.FC = () => {
  const [selectedWeekId, setSelectedWeekId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const { data: weeks } = useWeeks();
  const { data: modules } = useModules();
  const { data: allLinks, isLoading: linksLoading } = useWeekModuleLinks();
  const { mutate: createLink, isPending: creating } = useCreateWeekModuleLink();
  const { mutate: deleteLink } = useDeleteWeekModuleLink();
  const { mutate: updateOrder } = useUpdateWeekModuleLinkOrder();
  const { toast } = useToast();

  const handleCreateLink = () => {
    if (!selectedWeekId || !selectedModuleId) {
      toast({
        title: "Missing Selection",
        description: "Please select both a week and a module.",
        variant: "destructive",
      });
      return;
    }

    // Get current order for this week
    const weekLinks = allLinks?.filter(l => l.week_id === selectedWeekId) || [];
    const nextOrder = weekLinks.length;

    createLink({ 
      weekId: selectedWeekId, 
      moduleId: selectedModuleId, 
      orderIndex: nextOrder 
    });

    setSelectedWeekId('');
    setSelectedModuleId('');
    setShowLinkDialog(false);
  };

  const handleMoveUp = (linkId: string, currentOrder: number) => {
    if (currentOrder > 0) {
      updateOrder({ linkId, orderIndex: currentOrder - 1 });
    }
  };

  const handleMoveDown = (linkId: string, currentOrder: number, maxOrder: number) => {
    if (currentOrder < maxOrder) {
      updateOrder({ linkId, orderIndex: currentOrder + 1 });
    }
  };

  if (linksLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Week-Module Links</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  // Group links by week
  const linksByWeek = allLinks?.reduce((acc, link) => {
    if (!acc[link.week_id]) acc[link.week_id] = [];
    acc[link.week_id].push(link);
    return acc;
  }, {} as Record<string, typeof allLinks>) || {};

  // Sort links within each week by order
  Object.values(linksByWeek).forEach(weekLinks => {
    weekLinks.sort((a, b) => a.order_index - b.order_index);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Week-Module Links</CardTitle>
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Link Module to Week
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Module to Week</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Week</label>
                  <Select value={selectedWeekId} onValueChange={setSelectedWeekId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a week..." />
                    </SelectTrigger>
                    <SelectContent>
                      {weeks?.map((week) => (
                        <SelectItem key={week.id} value={week.id}>
                          Week {week.week_number}: {week.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Select Module</label>
                  <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a module..." />
                    </SelectTrigger>
                    <SelectContent>
                      {modules?.filter(m => m.published && m.has_slide_experience).map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLink} disabled={creating}>
                    {creating ? <LoadingSpinner size="sm" /> : <Link className="w-4 h-4 mr-2" />}
                    Link Module
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {weeks?.map((week) => {
          const weekLinks = linksByWeek[week.id] || [];
          
          return (
            <div key={week.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Week {week.week_number}: {week.title}
                </h3>
                <Badge variant="secondary">
                  {weekLinks.length} modules
                </Badge>
              </div>

              {weekLinks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No modules linked to this week yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {weekLinks.map((link, index) => {
                    const module = modules?.find(m => m.id === link.module_id);
                    if (!module) return null;

                    return (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="w-8 text-center">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{module.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {module.completion_points || 100} OP
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(link.id, link.order_index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(link.id, link.order_index, weekLinks.length - 1)}
                            disabled={index === weekLinks.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLink(link.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Unlink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {(!weeks || weeks.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No weeks available. Create weeks first to link modules.
          </div>
        )}
      </CardContent>
    </Card>
  );
};