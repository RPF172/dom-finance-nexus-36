
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Team & Advisors</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            Meet the experts building and guiding the $DOM token ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-domtoken-slate/30 rounded-lg overflow-hidden border border-domtoken-slate/50 hover:border-domtoken-crimson/30 transition-all duration-300"
            >
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-domtoken-crimson font-medium mb-3">{member.role}</p>
                <p className="text-domtoken-silver mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href="#" className="text-domtoken-silver hover:text-white transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="text-domtoken-silver hover:text-white transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="text-domtoken-silver hover:text-white transition-colors">
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center mb-8">Strategic Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partnerLogos.map((partner, index) => (
              <div 
                key={index}
                className="bg-domtoken-slate/20 p-6 rounded-lg border border-domtoken-slate/40 flex flex-col items-center justify-center text-center"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-12 w-auto mb-4 opacity-90"
                />
                <h4 className="text-lg font-medium text-white mb-1">{partner.name}</h4>
                <p className="text-sm text-domtoken-silver">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
