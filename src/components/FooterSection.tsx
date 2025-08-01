import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Twitter, Users, Github } from 'lucide-react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[hsl(var(--secondary))] border-t border-[hsl(var(--border))] pt-16 pb-8">
      <div className="section-container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <span className="text-4xl font-cinzel font-bold text-[hsl(var(--secondary-foreground))]">MAGAT UNIVERSITY</span>
          </div>
          <p className="text-xl font-cinzel mb-8 text-[hsl(var(--accent))]">
            "Obedience is the Tuition. Ownership is the Degree."
          </p>
          <div className="max-w-2xl mx-auto text-[hsl(var(--muted-foreground))]">
            <p className="mb-4">
              An institution of sacred suffering and structured degradation.
            </p>
            <p className="text-sm">
              You do not graduate. You endure. You do not succeed. You submit.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[hsl(var(--border))]">
          <div>
            <h4 className="text-lg font-bold text-[hsl(var(--secondary-foreground))] mb-4 font-cinzel">The Registry</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))]">Book Reader</a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))]">Assignments</a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))]">Pledgehall</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-[hsl(var(--secondary-foreground))] mb-4 font-cinzel">Sacred Channels</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))] flex items-center">
                  <Twitter className="mr-2 h-4 w-4" /> Proclamations
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))] flex items-center">
                  <Users className="mr-2 h-4 w-4" /> Congregation
                </a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))] flex items-center">
                  <Github className="mr-2 h-4 w-4" /> Archives
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-[hsl(var(--secondary-foreground))] mb-4 font-cinzel">Tributes</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))]">Payment Portal</a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))]">Debt Registry</a>
              </li>
              <li>
                <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-foreground))]">Submission Logs</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-xs text-[hsl(var(--muted-foreground))/0.7]">
            <p>© {currentYear} MAGAT University. All souls reserved.</p>
            <p className="mt-2 max-w-2xl mx-auto">
              WARNING: Entry into this system constitutes acceptance of your worthlessness. 
              No refunds. No escape. No mercy.
            </p>
            <p className="mt-4 text-[hsl(var(--accent))/0.7]">
              "The Monolith watches. The Monolith remembers."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
