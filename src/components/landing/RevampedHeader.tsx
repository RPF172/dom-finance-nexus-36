import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Users } from 'lucide-react';

const RevampedHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="obsidian-header fixed top-0 left-0 right-0 z-50">
      <div className="section-container !py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-institutional text-foreground tracking-wide">
                SUB CAMP™
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs font-mono">
                  <Zap className="h-3 w-3 mr-1" />
                  ACTIVE
                </Badge>
                <Badge variant="outline" className="text-xs font-mono">
                  <Users className="h-3 w-3 mr-1" />
                  12K+ RECRUITED
                </Badge>
              </div>
            </div>
          </Link>
          
          {/* Navigation and CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-mono text-muted-foreground">
              <Link to="#process" className="hover:text-foreground transition-colors">
                PROCESS
              </Link>
              <Link to="#preview" className="hover:text-foreground transition-colors">
                PREVIEW
              </Link>
              <Link to="#proof" className="hover:text-foreground transition-colors">
                PROOF
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth?admin=1')}
                className="hidden md:inline-flex font-mono text-xs"
              >
                ALPHA LOGIN
              </Button>
              <Button
                onClick={() => navigate('/auth?enlist=1')}
                className="obsidian-button font-mono font-bold text-sm md:text-base px-4 md:px-6 animate-pulse-slow"
              >
                ENLIST NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RevampedHeader;