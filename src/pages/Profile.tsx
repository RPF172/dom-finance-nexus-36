import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';
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
  Gift
} from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-institutional uppercase tracking-wide mb-2">Profile</h1>
            <p className="text-muted-foreground">Your institutional standing</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="institutional-card">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center">
                    <Crown className="h-12 w-12 text-primary" />
                  </div>
                  
                  {/* Basic Info */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>🔖 Collar ID:</span>
                      <Badge variant="outline" className="font-mono">#739AFD</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>🏛️ Role:</span>
                      <Badge variant="destructive">SUBMISSIVE</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>🎖️ Rank:</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        OBEDIENT SLUG
                      </Badge>
                    </div>
                    <div className="text-sm italic text-muted-foreground mt-3">
                      💬 "Unworthy. Unwavering."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <Card className="institutional-card">
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

            {/* Recent Activity */}
            <Card className="institutional-card">
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

            {/* Badges & Relics */}
            <Card className="institutional-card">
              <CardHeader>
                <CardTitle className="text-lg tracking-wide">BADGES & RELICS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
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

            {/* About Section */}
            <Card className="institutional-card">
              <CardHeader>
                <CardTitle className="text-lg tracking-wide">ABOUT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm italic text-center p-4 bg-muted/30 rounded-lg">
                  "I enrolled to unlearn freedom. Pain makes sense. I hope to be chosen."
                </div>
              </CardContent>
            </Card>

            {/* Contact / Actions */}
            <Card className="institutional-card">
              <CardHeader>
                <CardTitle className="text-lg tracking-wide">CONTACT / ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 institutional-button"
                  onClick={() => navigate('/assignments')}
                >
                  <MessageCircle className="h-4 w-4" />
                  💬 Send Ritual Request
                </Button>
                
                <Button
                  className="w-full flex items-center gap-2 institutional-button"
                  onClick={() => navigate('/tribute')}
                >
                  <Gift className="h-4 w-4" />
                  🕯️ Tribute Offering
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;