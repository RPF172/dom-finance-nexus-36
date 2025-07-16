
import React from 'react';
import { Coins, Shield, Flame, Vote, Crown, Zap, Gift, Link } from 'lucide-react';

const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: "Direct Tribute Payments",
      description: "Paypigs send $DOM directly to their dommes as proof of worthlessness, with auto-burn taxes amplifying humiliation."
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Staking for Status",
      description: "Subs stake $DOM to gain humiliating ranks, gated Discord roles, and exclusive ritual invites."
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Punishment Pools",
      description: "Creators set up pools where staked $DOM can be burned for punishment or destroyed to assert dominance."
    },
    {
      icon: <Vote className="w-8 h-8" />,
      title: "Governance Voting",
      description: "High holders vote on new ritual ideas, community punishment protocols, and token burn events."
    },
    {
      icon: <Link className="w-8 h-8" />,
      title: "Platform Integration",
      description: "Platforms integrate $DOM as a payment rail with deflationary mechanics and access gating for premium features."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "NFT Collars & Ownership",
      description: "Mint NFT collars or digital ownership contracts that require burning or staking $DOM to activate."
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Cross-Platform Tips",
      description: "Use $DOM to tip across multiple creator platforms without bank bans or exposure risks."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Ritual Burn Events",
      description: "Quarterly punishment burn events and tribute burn rituals for ultimate scarcity and humiliation."
    }
  ];

  return (
    <section className="py-20 bg-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            Built for <span className="text-domtoken-crimson">Financial Domination</span>
          </h2>
          <p className="text-xl text-domtoken-silver max-w-3xl mx-auto">
            $DOM provides eight core utilities that traditional payment systems and generic cryptocurrencies simply cannot match.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6 hover:border-domtoken-crimson/50 transition-all duration-300 group"
            >
              <div className="text-domtoken-crimson mb-4 group-hover:scale-110 transition-transform duration-300">
                {useCase.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-domtoken-crimson transition-colors duration-300">
                {useCase.title}
              </h3>
              <p className="text-domtoken-silver text-sm leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
