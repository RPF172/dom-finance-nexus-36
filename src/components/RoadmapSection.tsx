
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const roadmapItems = [
  {
    quarter: "Q2 2025",
    milestone: "$DOM smart-contract audit, testnet launch",
    completed: true
  },
  {
    quarter: "Q3 2025",
    milestone: "Mainnet launch & initial DEX listings",
    completed: false
  },
  {
    quarter: "Q4 2025",
    milestone: "Creator staking & governance module live",
    completed: false
  },
  {
    quarter: "Q1 2026",
    milestone: "Cross-chain bridge & DeFi integrations",
    completed: false
  },
  {
    quarter: "H2 2026",
    milestone: "DAO treasury activation & revenue-share pools",
    completed: false
  }
];

const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="py-24 bg-domtoken-obsidian">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Roadmap & Milestones</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            Our strategic timeline for $DOM token development, platform integration, and ecosystem expansion.
          </p>
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 ml-[5px] md:ml-0 h-full w-0.5 bg-domtoken-slate/50 transform -translate-x-1/2" />

          {roadmapItems.map((item, index) => (
            <div key={index} className="relative mb-12">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Circle indicator */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10">
                  {item.completed ? (
                    <CheckCircle className="h-10 w-10 text-domtoken-crimson bg-domtoken-obsidian rounded-full" />
                  ) : (
                    <Circle className="h-10 w-10 text-domtoken-slate bg-domtoken-obsidian rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className={`md:w-1/2 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                  <div className={`p-6 bg-domtoken-slate/30 rounded-lg border ${item.completed ? 'border-domtoken-crimson/50' : 'border-domtoken-slate/50'}`}>
                    <h3 className={`text-xl font-bold mb-1 ${item.completed ? 'text-domtoken-crimson' : 'text-white'}`}>{item.quarter}</h3>
                    <p className="text-domtoken-silver">{item.milestone}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
