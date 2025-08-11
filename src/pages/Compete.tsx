import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useObedience } from '@/hooks/useObedience';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';

const games = [
  { id: 'typing-trial', title: 'Typing Trial', description: 'Militarized speed & accuracy drill.', href: '/games/typing-trial' },
  { id: 'game-2', title: 'Tier Trials', description: 'Climb through escalating tasks.' },
  { id: 'game-3', title: 'Quiz Gauntlet', description: 'Test knowledge under pressure.' },
  { id: 'game-4', title: 'Endurance Run', description: 'Maintain streaks to win.' },
  { id: 'game-5', title: 'Social Arena', description: 'Engage and earn community bonuses.' },
  { id: 'game-6', title: 'Mystery Hunt', description: 'Find clues and unlock rewards.' },
];

const Compete: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: obedience } = useObedience();

  const op = obedience?.summary?.total_points ?? 0;
  const gold = 0; // TODO: Replace with real gold balance when available

  // Basic SEO without extra deps
  useEffect(() => {
    const title = 'Compete — Sub Camp Games Hub';
    const description = 'Compete in Sub Camp games. Track your Obedience Points and Gold, and discover new challenges.';

    document.title = title;

    const ensureTag = (selector: string, tagName: string) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement(tagName);
        document.head.appendChild(el);
      }
      return el as HTMLMetaElement & HTMLLinkElement & HTMLElement;
    };

    const desc = ensureTag('meta[name="description"]', 'meta') as HTMLMetaElement;
    desc.setAttribute('name', 'description');
    desc.setAttribute('content', description);

    const canonical = ensureTag('link[rel="canonical"]', 'link') as HTMLLinkElement;
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.origin + '/compete');
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="sr-only">Compete — Sub Camp Games Hub</h1>
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Left: Avatar */}
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage loading="lazy" src={profile?.avatar_url ?? undefined} alt={(profile?.display_name || 'User') + ' Sub Camp avatar'} />
              <AvatarFallback>{(profile?.display_name || 'U').slice(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* Center: Username */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Player</div>
            <div className="text-2xl font-bold tracking-wide">{profile?.display_name || 'Anonymous'}</div>
          </div>

          {/* Right: Currencies */}
          <div className="flex items-center justify-end gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Obedience Points</div>
              <div className="text-xl font-semibold">{op}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Gold</div>
              <div className="text-xl font-semibold">{gold}</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section aria-label="Available Games">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((g) => (
              <Card key={g.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{g.title}</CardTitle>
                    <Badge variant="outline">{g.href ? 'Playable' : 'Coming Soon'}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {g.id === 'typing-trial' && (
                    <div className="mb-4 -mx-6">
                      <OptimizedImage
                        src="/lovable-uploads/38c87cb9-bd70-4250-a4da-29dd99c28e51.png"
                        alt="Typing Trial — Prove your precision poster"
                        aspectRatio="video"
                        className="w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">{g.description}</p>
                  {g.href && (
                    <Link to={g.href} className="inline-block"><Button>Play</Button></Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Compete;
