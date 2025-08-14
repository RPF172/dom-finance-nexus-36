import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, MessageSquare, BookOpen, Plus, Clock, Target } from 'lucide-react';
import { AccessibleHeading, AccessibleButton } from '@/components/ui/enhanced-accessibility';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  week_id?: string;
  max_members: number;
  current_members: number;
  is_active: boolean;
  created_at: string;
  created_by: string;
  members?: {
    user_id: string;
    joined_at: string;
    profiles: {
      display_name: string;
      avatar_url?: string;
      is_premium?: boolean;
    };
  }[];
}

interface StudyGroupProps {
  weekId?: string;
  currentUserId?: string;
}

export const StudyGroup: React.FC<StudyGroupProps> = ({ weekId, currentUserId }) => {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudyGroups();
  }, [weekId]);

  const fetchStudyGroups = async () => {
    try {
      let query = supabase
        .from('study_groups')
        .select(`
          *,
          study_group_members!inner(
            user_id,
            joined_at,
            profiles!inner(
              display_name,
              avatar_url,
              is_premium
            )
          )
        `)
        .eq('is_active', true);

      if (weekId) {
        query = query.eq('week_id', weekId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Process the data to group members properly
      const processedGroups = data?.map(group => ({
        ...group,
        members: group.study_group_members || [],
        current_members: group.study_group_members?.length || 0
      })) || [];

      setStudyGroups((processedGroups || []) as StudyGroup[]);
    } catch (error) {
      console.error('Error fetching study groups:', error);
      toast({
        title: "Error",
        description: "Failed to load study groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudyGroup = async () => {
    if (!currentUserId || !newGroupName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('study_groups')
        .insert({
          name: newGroupName.trim(),
          description: newGroupDescription.trim(),
          week_id: weekId,
          max_members: maxMembers,
          created_by: currentUserId,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the creator to the group
      await supabase
        .from('study_group_members')
        .insert({
          study_group_id: data.id,
          user_id: currentUserId
        });

      toast({
        title: "Success",
        description: "Study group created successfully!",
      });

      setNewGroupName('');
      setNewGroupDescription('');
      setMaxMembers(5);
      setShowCreateDialog(false);
      fetchStudyGroups();

    } catch (error) {
      console.error('Error creating study group:', error);
      toast({
        title: "Error",
        description: "Failed to create study group",
        variant: "destructive",
      });
    }
  };

  const joinStudyGroup = async (groupId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          study_group_id: groupId,
          user_id: currentUserId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Joined study group successfully!",
      });

      fetchStudyGroups();

    } catch (error) {
      console.error('Error joining study group:', error);
      toast({
        title: "Error",
        description: "Failed to join study group",
        variant: "destructive",
      });
    }
  };

  const leaveStudyGroup = async (groupId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('study_group_id', groupId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Left study group successfully!",
      });

      fetchStudyGroups();

    } catch (error) {
      console.error('Error leaving study group:', error);
      toast({
        title: "Error",
        description: "Failed to leave study group",
        variant: "destructive",
      });
    }
  };

  const isUserInGroup = (group: StudyGroup) => {
    return group.members?.some(member => member.user_id === currentUserId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <AccessibleHeading level={2} className="text-xl">
            Study Groups
          </AccessibleHeading>
          <p className="text-sm text-muted-foreground">
            Collaborate with peers and enhance your learning experience
          </p>
        </div>
        
        {currentUserId && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <AccessibleButton
                ariaLabel="Create new study group"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Group
              </AccessibleButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="group-name" className="block text-sm font-medium mb-2">
                    Group Name *
                  </label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    maxLength={50}
                    aria-required="true"
                  />
                </div>
                
                <div>
                  <label htmlFor="group-description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    id="group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="What will your group focus on?"
                    maxLength={200}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="max-members" className="block text-sm font-medium mb-2">
                    Max Members
                  </label>
                  <Input
                    id="max-members"
                    type="number"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(parseInt(e.target.value) || 5)}
                    min={2}
                    max={20}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={createStudyGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1"
                  >
                    Create Group
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Study Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyGroups.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No study groups yet. {currentUserId ? "Create the first one!" : "Sign in to create or join groups."}
            </p>
          </div>
        ) : (
          studyGroups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="outline">
                    {group.current_members}/{group.max_members}
                  </Badge>
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Members */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {group.members?.slice(0, 3).map((member, index) => (
                      <Avatar key={member.user_id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.profiles.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {member.profiles.display_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {group.current_members > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{group.current_members - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {group.current_members} member{group.current_members !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Actions */}
                {currentUserId && (
                  <div className="flex gap-2">
                    {isUserInGroup(group) ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => leaveStudyGroup(group.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Leave
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => joinStudyGroup(group.id)}
                        disabled={group.current_members >= group.max_members}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {group.current_members >= group.max_members ? 'Full' : 'Join'}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};