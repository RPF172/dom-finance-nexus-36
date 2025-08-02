import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import AppLayout from '@/components/layout/AppLayout';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { HeaderImageUpload } from '@/components/profile/HeaderImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  MessageCircle,
  DollarSign,
  BookOpen,
  ClipboardList,
  Zap,
  Award,
  Lock,
  Clock,
  Gift,
  MapPin,
  Globe,
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  collar_id?: string;
  is_premium?: boolean;
  created_at?: string;
  interests?: string[];
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
    cover_photo_url: ''
  });

  const { data: ownProfile, isLoading: ownProfileLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // Fetch viewed profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        // Viewing someone else's profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (data) setViewedProfile(data);
      } else if (ownProfile) {
        // Viewing own profile
        setViewedProfile(ownProfile);
        setEditData({
          display_name: ownProfile.display_name || '',
          bio: ownProfile.bio || '',
          location: ownProfile.location || '',
          website: ownProfile.website || '',
          avatar_url: ownProfile.avatar_url || '',
          cover_photo_url: ownProfile.cover_photo_url || ''
        });
      }
    };

    fetchProfile();
  }, [userId, ownProfile]);

  const isOwner = !userId || (currentUser && userId === currentUser.id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(editData);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (ownProfile) {
      setEditData({
        display_name: ownProfile.display_name || '',
        bio: ownProfile.bio || '',
        location: ownProfile.location || '',
        website: ownProfile.website || '',
        avatar_url: ownProfile.avatar_url || '',
        cover_photo_url: ownProfile.cover_photo_url || ''
      });
    }
  };

  const handleAvatarUpdate = (url: string) => {
    setEditData(prev => ({ ...prev, avatar_url: url }));
    if (!isEditing) {
      updateProfile.mutate({ avatar_url: url });
    }
  };

  const handleHeaderUpdate = (url: string) => {
    setEditData(prev => ({ ...prev, cover_photo_url: url }));
    if (!isEditing) {
      updateProfile.mutate({ cover_photo_url: url });
    }
  };

  if (ownProfileLoading || !viewedProfile) {
    return (
      <AppLayout>
        <div className="p-6 text-center">Loading profile...</div>
      </AppLayout>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header Image */}
        <HeaderImageUpload
          currentImage={viewedProfile.cover_photo_url}
          onImageUpdate={handleHeaderUpdate}
          isOwner={isOwner}
        />

        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <AvatarUpload
                    currentAvatar={viewedProfile.avatar_url}
                    onAvatarUpdate={handleAvatarUpdate}
                    isOwner={isOwner}
                    size="lg"
                    fallbackText={viewedProfile.display_name || 'User'}
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {isEditing ? (
                        <Input
                          value={editData.display_name}
                          onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                          placeholder="Display name"
                          className="text-2xl font-institutional mb-2"
                        />
                      ) : (
                        <h1 className="text-2xl font-institutional uppercase tracking-wide mb-2">
                          {viewedProfile.display_name || 'Unknown User'}
                        </h1>
                      )}
                      
                      {viewedProfile.collar_id && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-sm">
                            🔖 Collar ID: {viewedProfile.collar_id}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={viewedProfile.is_premium ? "bg-gradient-to-r from-amber-500 to-yellow-600" : "bg-muted"}>
                          {viewedProfile.is_premium ? '👑 PREMIUM' : '📿 OBEDIENT SLUG'}
                        </Badge>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={handleSave} disabled={updateProfile.status === 'pending'}>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={handleEdit}>
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit Profile
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="mb-4">
                    {isEditing ? (
                      <Textarea
                        value={editData.bio}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        {viewedProfile.bio || 'No bio available.'}
                      </p>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {(viewedProfile.location || isEditing) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {isEditing ? (
                          <Input
                            value={editData.location}
                            onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Location"
                            className="h-6 text-sm"
                          />
                        ) : (
                          <span>{viewedProfile.location}</span>
                        )}
                      </div>
                    )}
                    
                    {(viewedProfile.website || isEditing) && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {isEditing ? (
                          <Input
                            value={editData.website}
                            onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Website"
                            className="h-6 text-sm"
                          />
                        ) : (
                          <a href={viewedProfile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                            {viewedProfile.website}
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(viewedProfile.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Activity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg tracking-wide">STATS OVERVIEW</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-1">
                      <BookOpen className="h-6 w-6 mx-auto text-primary" />
                      <div className="text-2xl font-bold">9</div>
                      <div className="text-xs text-muted-foreground">Chapters Completed</div>
                    </div>
                    <div className="text-center space-y-1">
                      <ClipboardList className="h-6 w-6 mx-auto text-primary" />
                      <div className="text-2xl font-bold">27</div>
                      <div className="text-xs text-muted-foreground">Assignments Done</div>
                    </div>
                    <div className="text-center space-y-1">
                      <Zap className="h-6 w-6 mx-auto text-destructive" />
                      <div className="text-2xl font-bold text-destructive">3</div>
                      <div className="text-xs text-muted-foreground">Punishments Received</div>
                    </div>
                    <div className="text-center space-y-1">
                      <DollarSign className="h-6 w-6 mx-auto text-green-500" />
                      <div className="text-2xl font-bold text-green-500">$142.69</div>
                      <div className="text-xs text-muted-foreground">Tribute Given</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges & Relics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg tracking-wide">BADGES & RELICS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <Award className="h-6 w-6 text-primary" />
                      <div>
                        <div className="text-sm font-medium">🏅 Obedience Relic</div>
                        <div className="text-xs text-muted-foreground">Crimson Chain</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">📿 Shame Seal</div>
                        <div className="text-xs text-muted-foreground">Locked 🔒</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <Clock className="h-6 w-6 text-amber-500" />
                      <div>
                        <div className="text-sm font-medium text-amber-500">🧿 Master's Favor</div>
                        <div className="text-xs text-muted-foreground">Pending…</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg tracking-wide">RECENT ACTIVITY</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Finished "Chapter V: Erosion"</div>
                      <div className="text-xs text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Submitted: "Video of Humiliation"</div>
                      <div className="text-xs text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <Zap className="h-5 w-5 text-destructive" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-destructive">Missed Task: "Public Degradation" ❌</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-500">Paid Tribute: $20</div>
                      <div className="text-xs text-muted-foreground">3 days ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Actions - Only show if viewing someone else's profile */}
              {!isOwner && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg tracking-wide">CONTACT ACTIONS</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Send Tribute
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg tracking-wide">QUICK ACTIONS</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => navigate('/assignments')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      💬 Send Ritual Request
                    </Button>
                    
                    <Button
                      className="flex items-center gap-2"
                      onClick={() => navigate('/tribute')}
                    >
                      <Gift className="h-4 w-4" />
                      🕯️ Tribute Offering
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;