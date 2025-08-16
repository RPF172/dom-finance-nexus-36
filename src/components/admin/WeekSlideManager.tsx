import React, { useState } from 'react';
import { Plus, Settings, Eye, Trash2, ArrowUp, ArrowDown, Link, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWeeks } from '@/hooks/useWeeks';
import { useWeekModuleLinks, useCreateWeekModuleLink, useDeleteWeekModuleLink, useUpdateWeekModuleLinkOrder } from '@/hooks/useWeekModuleLinks';
import { useModules } from '@/hooks/useLessons';
import { useModuleSlides } from '@/hooks/useModuleSlides';
import { SlideBuilder } from './SlideBuilder';
import WeekEditorModal from './WeekEditorModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

export const WeekSlideManager: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [selectedModuleForLink, setSelectedModuleForLink] = useState<string>('');
  const [activeTab, setActiveTab] = useState('weeks');

  const { data: weeks, refetch: refetchWeeks } = useWeeks();
  const { data: modules } = useModules();
  const { data: weekModuleLinks } = useWeekModuleLinks(selectedWeek || undefined);
  const { data: moduleSlides } = useModuleSlides(selectedModule || '');
  const { mutate: createLink, isPending: creating } = useCreateWeekModuleLink();
  const { mutate: deleteLink } = useDeleteWeekModuleLink();
  const { mutate: updateOrder } = useUpdateWeekModuleLinkOrder();
  const { toast } = useToast();

  const linkedModules = weekModuleLinks?.map(link => 
    modules?.find(module => module.id === link.module_id)
  ).filter(Boolean) || [];

  const handleWeekCreated = () => {
    refetchWeeks();
    setShowWeekModal(false);
  };

  const handleCreateLink = () => {
    if (!selectedWeek || !selectedModuleForLink) {
      toast({
        title: "Missing Selection",
        description: "Please select a module to link.",
        variant: "destructive",
      });
      return;
    }

    const nextOrder = weekModuleLinks?.length || 0;
    createLink({ 
      weekId: selectedWeek, 
      moduleId: selectedModuleForLink, 
      orderIndex: nextOrder 
    });

    setSelectedModuleForLink('');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-institutional uppercase tracking-wider">
          Week & Slide Management
        </h1>
        <Button onClick={() => setShowWeekModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Week
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weeks">Week Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Assignment</TabsTrigger>
          <TabsTrigger value="slides">Slide Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="weeks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weeks?.map((week) => (
              <Card 
                key={week.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedWeek === week.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedWeek(week.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Week {week.week_number}
                    </CardTitle>
                     <Badge variant="outline">
                       {selectedWeek === week.id ? weekModuleLinks?.length || 0 : 0} modules
                     </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{week.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {week.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWeek(week.id);
                        setActiveTab('modules');
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to week experience
                        window.open(`/week-slides/${week.id}`, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          {!selectedWeek ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Select a week from the Week Overview tab to manage its modules
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Modules for Week {weeks?.find(w => w.id === selectedWeek)?.week_number}
                </h2>
                <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Link Module
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Link Module to Week</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Select Module</label>
                        <Select value={selectedModuleForLink} onValueChange={setSelectedModuleForLink}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a module..." />
                          </SelectTrigger>
                          <SelectContent>
                            {modules?.filter(m => m.published && m.has_slide_experience && !weekModuleLinks?.some(l => l.module_id === m.id)).map((module) => (
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
              
              <div className="space-y-2">
                {weekModuleLinks?.map((link, index) => {
                  const module = modules?.find(m => m.id === link.module_id);
                  if (!module) return null;

                  return (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-8 text-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h3 className="font-semibold">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant={module.has_slide_experience ? 'default' : 'secondary'}>
                              {module.has_slide_experience ? 'Has Slides' : 'No Slides'}
                            </Badge>
                            <Badge variant="outline">
                              {module.completion_points} OP
                            </Badge>
                          </div>
                        </div>
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
                          onClick={() => handleMoveDown(link.id, link.order_index, (weekModuleLinks?.length || 1) - 1)}
                          disabled={index === (weekModuleLinks?.length || 1) - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedModule(module.id);
                            setActiveTab('slides');
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Edit Slides
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
                
                {(!weekModuleLinks || weekModuleLinks.length === 0) && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">
                        No modules linked to this week yet. Click "Link Module" to add one.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="slides" className="space-y-4">
          {!selectedModule ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Select a module from the Module Assignment tab to edit its slides
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Slide Builder - {modules?.find(m => m.id === selectedModule)?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Create and manage slides for this module
                  </p>
                </div>
                <Badge variant="outline">
                  {moduleSlides?.length || 0} slides
                </Badge>
              </div>
              
              <SlideBuilder 
                moduleId={selectedModule} 
                onSave={() => {
                  // Optionally refresh data or show success
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <WeekEditorModal
        isOpen={showWeekModal}
        onClose={() => setShowWeekModal(false)}
        onCreated={handleWeekCreated}
      />
    </div>
  );
};