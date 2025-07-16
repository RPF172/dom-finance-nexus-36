
import React from 'react';

const ComparisonSection: React.FC = () => {
  const comparisons = [
    {
      name: "Bitcoin (BTC)",
      price: "~$60,000",
      utility: "Digital gold",
      kinkUtility: "None",
      burns: "No",
      privacy: "Pseudonymous",
      adultFriendly: "Neutral",
      status: "❌"
    },
    {
      name: "Ethereum (ETH)",
      price: "~$3,200",
      utility: "DeFi & Gas",
      kinkUtility: "None",
      burns: "No",
      privacy: "Pseudonymous",
      adultFriendly: "Neutral",
      status: "❌"
    },
    {
      name: "Cash App",
      price: "Free",
      utility: "P2P Payments",
      kinkUtility: "None",
      burns: "No",
      privacy: "Full KYC",
      adultFriendly: "Banned",
      status: "❌"
    },
    {
      name: "$DOM",
      price: "$0.01-$0.10",
      utility: "Tribute & Kink",
      kinkUtility: "Built-in",
      burns: "5-10%",
      privacy: "Anonymous",
      adultFriendly: "Purpose-built",
      status: "✅"
    }
  ];

  return (
    <section className="py-20 bg-domtoken-slate/10">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            Why <span className="text-domtoken-crimson">$DOM</span> Dominates
          </h2>
          <p className="text-xl text-domtoken-silver max-w-3xl mx-auto">
            Compare $DOM's purpose-built features against traditional payment systems and generic cryptocurrencies.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-domtoken-slate/30">
                <th className="text-left p-4 text-domtoken-silver font-semibold">Platform</th>
                <th className="text-left p-4 text-domtoken-silver font-semibold">Price Range</th>
                <th className="text-left p-4 text-domtoken-silver font-semibold">Primary Utility</th>
                <th className="text-left p-4 text-domtoken-silver font-semibold">Kink Features</th>
                <th className="text-left p-4 text-domtoken-silver font-semibold">Deflationary</th>
                <th className="text-left p-4 text-domtoken-silver font-semibold">Privacy</th>
                <th className="text-left p-4 text-domtoken-silver font-semibold">Adult-Friendly</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr 
                  key={index}
                  className={`border-b border-domtoken-slate/20 hover:bg-domtoken-slate/10 transition-colors ${
                    item.name === '$DOM' ? 'bg-domtoken-crimson/10 border-domtoken-crimson/30' : ''
                  }`}
                >
                  <td className={`p-4 font-semibold ${item.name === '$DOM' ? 'text-domtoken-crimson' : 'text-white'}`}>
                    {item.name}
                  </td>
                  <td className="p-4 text-domtoken-silver">{item.price}</td>
                  <td className="p-4 text-domtoken-silver">{item.utility}</td>
                  <td className="p-4 text-domtoken-silver">{item.kinkUtility}</td>
                  <td className="p-4 text-domtoken-silver">{item.burns}</td>
                  <td className="p-4 text-domtoken-silver">{item.privacy}</td>
                  <td className="p-4 text-domtoken-silver">{item.adultFriendly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-12 bg-domtoken-crimson/10 border border-domtoken-crimson/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-domtoken-crimson mb-4">The $DOM Advantage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Psychological Accessibility</h4>
              <p className="text-domtoken-silver text-sm">Low unit price ($0.01-$0.10) means even broke pigs can pay tribute daily.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Deflationary Mechanics</h4>
              <p className="text-domtoken-silver text-sm">Every transaction burns supply, creating scarcity and increasing value over time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Purpose-Built Features</h4>
              <p className="text-domtoken-silver text-sm">Tribute, burn, rank, and ritual mechanics unmatched by generic tokens.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
