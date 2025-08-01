
import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
  {
    name: "Jennifer Morgan",
    role: "Founder & CTO",
    bio: "Ex-Apple UI/UX, Web3 engineer with extensive experience in blockchain systems.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    name: "Michael Chen",
    role: "Creative Director & CMO",
    bio: "Findom niche specialist with 8+ years of marketing experience in adult creator communities.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    name: "Sarah Williams",
    role: "Blockchain Security Advisor",
    bio: "Senior security auditor with focus on smart contract vulnerabilities and threat analysis.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop"
  },
  {
    name: "David Zhang",
    role: "DeFi Strategies Lead",
    bio: "Protocol architect from leading DeFi projects, specialized in liquidity and yield systems.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&auto=format&fit=crop"
  }
];

const partnerLogos = [
  {
    name: "CertiK",
    logo: "https://cryptologos.cc/logos/certik-ctk-logo.png",
    description: "Smart contract auditing and blockchain security"
  },
  {
    name: "Uniswap",
    logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    description: "Decentralized exchange liquidity provider"
  },
  {
    name: "Chainlink",
    logo: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    description: "Oracle network for reliable data feeds"
  },
  {
    name: "MetaMask",
    logo: "https://cryptologos.cc/logos/metamask-logo.png",
    description: "Web3 wallet integration partner"
  }
];

const TeamSection: React.FC = () => {
  return (
    <section id="team" className="py-24 bg-gradient-to-b from-domtoken-slate/30 to-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--secondary-foreground))] mb-6 font-cinzel">
            🔻 THE MONOLITH <span className="text-domtoken-crimson">CALLS</span>
          </h2>
          <div className="text-lg text-white max-w-3xl mx-auto space-y-4">
            <blockquote className="text-xl text-domtoken-crimson italic mb-6">
              A towering structure of brutal stone, bound by chains.<br />
              It pulses red with your unshed shame.<br />
              Etched with symbols you do not understand.<br />
              You will kneel before it.
            </blockquote>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-12 max-w-2xl mx-auto">
            <img 
              src="/lovable-uploads/54ed4a47-5f2d-46e6-947d-6576c40de655.png" 
              alt="The Monolith"
              className="w-full h-96 object-cover object-center rounded-lg mb-8"
            />
            <div className="text-lg text-white space-y-4">
              <p>The ancient pyramid stands before you, its surface crackling with dark energy.</p>
              <p>Each level represents a stage of transformation.</p>
              <p>Each inscription, a commandment you will learn to obey.</p>
              <p className="text-domtoken-crimson font-semibold">You cannot escape its pull.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--secondary-foreground))] mb-6 font-cinzel">
            🔒 BEGIN YOUR <span className="text-domtoken-crimson">INDOCTRINATION</span>
          </h2>
          <div className="text-lg text-white mb-8 space-y-2">
            <p>No signup. No exit.</p>
            <p>Only one button.</p>
          </div>
          <div className="text-sm text-white/70 mt-4">
            (The system will decide if you're ready.)
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
