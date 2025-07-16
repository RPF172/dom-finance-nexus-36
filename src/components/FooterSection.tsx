import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Twitter, Users, Github } from 'lucide-react';

const FooterSection: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0A0A0A] pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12 border-b border-domtoken-slate/30">
          <div>
            <h3 className="text-2xl font-cinzel font-bold text-white mb-6">Join the $DOM Community</h3>
            <p className="text-domtoken-silver mb-8 max-w-md">
              Be part of the revolution in creator finance. Connect with fellow investors, 
              creators, and developers building the SubSpace ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-domtoken-crimson hover:bg-domtoken-crimson/90 text-white">
                <Download className="mr-2 h-5 w-5" /> Download Whitepaper
              </Button>
              <Button variant="outline" className="border-domtoken-silver/30 hover:bg-domtoken-slate/40 text-domtoken-silver">
                <Mail className="mr-2 h-5 w-5" /> Investor Updates
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white flex items-center">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white flex items-center">
                    <Users className="mr-2 h-4 w-4" /> Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white flex items-center">
                    <Github className="mr-2 h-4 w-4" /> Github
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white">Developer API</a>
                </li>
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white">Brand Assets</a>
                </li>
                <li>
                  <a href="#" className="text-domtoken-silver hover:text-white">Support</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex justify-center mb-4">
            <span className="text-2xl font-cinzel text-domtoken-silver">$DOM</span>
          </div>
          <p className="text-sm text-domtoken-silver/70 mb-6">
            The native token of SubSpace—fueling a next-gen, creator-driven Web3 economy.
          </p>
          <div className="text-xs text-domtoken-silver/50">
            <p>© {currentYear} SubSpace DAO. All rights reserved.</p>
            <p className="mt-2 max-w-2xl mx-auto">
              Disclaimer: $DOM tokens are utility tokens for the SubSpace platform and do not represent
              securities or investment contracts. Always conduct your own research before participation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
