
import React from 'react';
import { 
  LockIcon, 
  TrendingUp, 
  VoteIcon, 
  Crown, 
  CreditCard, 
  BarChartHorizontal 
} from 'lucide-react';

const features = [
  {
    icon: <TrendingUp className="h-8 w-8 text-domtoken-crimson" />,
    title: "Staking for Yield",
    description: "Stake $DOM to earn priority platform rewards and passive income streams."
  },
  {
    icon: <VoteIcon className="h-8 w-8 text-domtoken-crimson" />,
    title: "Governance",
    description: "Vote on new features, platform policies, and partnership integrations."
  },
  {
    icon: <Crown className="h-8 w-8 text-domtoken-crimson" />,
    title: "Access & Perks",
    description: "Exclusive creator 'VIP' tiers and token-only content drops."
  },
  {
    icon: <CreditCard className="h-8 w-8 text-domtoken-crimson" />,
    title: "Fee Discounts",
    description: "Reduced platform fees when paying or tipping with $DOM."
  },
  {
    icon: <BarChartHorizontal className="h-8 w-8 text-domtoken-crimson" />,
    title: "Ecosystem Integrations",
    description: "Payment rails, NFT gating, on-chain tipping, DeFi partnerships."
  },
  {
    icon: <LockIcon className="h-8 w-8 text-domtoken-crimson" />,
    title: "Security & Compliance",
    description: "Smart-contract audit and robust legal compliance framework."
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">$DOM Token Utility</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            The $DOM token powers the SubSpace ecosystem with multiple utility functions 
            designed to reward holders and enrich the platform experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-domtoken-slate/30 p-6 rounded-lg border border-domtoken-slate/50 hover:border-domtoken-crimson/50 transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[hsl(var(--secondary-foreground))]">{feature.title}</h3>
              <p className="text-domtoken-silver">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-domtoken-slate/30 p-8 rounded-lg border border-domtoken-slate/50">
          <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--secondary-foreground))] text-center">Problem & Opportunity</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-domtoken-crimson mb-3">Pain Points</h4>
              <ul className="space-y-3 text-domtoken-silver">
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Centralized platforms extract fees and control creator earnings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Fragmented monetization tools limit community engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Limited revenue opportunities for creators in traditional platforms</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-domtoken-crimson mb-3">Market Size & Traction</h4>
              <ul className="space-y-3 text-domtoken-silver">
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Total Addressable Market in adult creator economy: $30+ billion by 2027</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Early traction: SubSpace monthly GMV, active users, top-performing creators</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-domtoken-crimson">•</span>
                  <span>Rapidly growing demand for decentralized payment solutions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
