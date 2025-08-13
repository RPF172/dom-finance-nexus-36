import React, { useState } from 'react';
import { Users, MessageSquare, Trophy, Activity, Bell, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedContent from '@/components/ProtectedContent';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import MessageCenter from '@/components/messaging/MessageCenter';
import CommunityChallenge from '@/components/community/CommunityChallenge';
import ActivityFeed from '@/components/activity/ActivityFeed';
import LiveInteractions from '@/components/live/LiveInteractions';

const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');

  return (
    <AppLayout>
      <ProtectedContent>
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                Community Hub
              </h1>
              <p className="text-muted-foreground mt-2">
                Connect, compete, and learn together with the community
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Live Stats Banner */}
          <LiveInteractions />

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-96">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">People</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-6">
              <ActivityFeed />
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <MessageCenter />
            </TabsContent>

            <TabsContent value="challenges" className="space-y-6">
              <CommunityChallenge />
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Directory</h3>
                <p className="text-muted-foreground mb-6">
                  Discover and connect with fellow learners in your community
                </p>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Browse Members
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedContent>
    </AppLayout>
  );
};

export default CommunityHub;