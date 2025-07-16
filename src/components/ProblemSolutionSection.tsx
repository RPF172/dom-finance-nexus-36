
import React from 'react';

const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 bg-domtoken-obsidian/50">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Problem */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-domtoken-crimson mb-6 font-cinzel">
                The Problem with Traditional Payment Systems
              </h2>
              <p className="text-domtoken-silver text-lg leading-relaxed mb-8">
                Current payment systems like Cash App, PayPal, Venmo, and even Bitcoin fail the findom community:
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-domtoken-crimson pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Banks Ban Adult Payments</h3>
                <p className="text-domtoken-silver">Traditional platforms restrict or ban adult-oriented transactions, leaving creators without reliable payment methods.</p>
              </div>
              
              <div className="border-l-4 border-domtoken-crimson pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">Privacy Exposure Risks</h3>
                <p className="text-domtoken-silver">Real names and IDs required, exposing both dommes and paypigs to unwanted identification and privacy breaches.</p>
              </div>
              
              <div className="border-l-4 border-domtoken-crimson pl-6">
                <h3 className="text-xl font-semibold text-white mb-2">No Integrated Kink Features</h3>
                <p className="text-domtoken-silver">Generic payment systems lack tribute mechanisms, status rankings, and psychological elements essential to findom.</p>
              </div>
            </div>
          </div>
          
          {/* Solution */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-domtoken-crimson mb-6 font-cinzel">
                Why $DOM is Superior
              </h2>
              <p className="text-domtoken-silver text-lg leading-relaxed mb-8">
                $DOM isn't just another cryptocurrency. It's a digital collar, a ledger of worthlessness, and a ritual tool:
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Built for Kink</h3>
                <p className="text-domtoken-silver">Bitcoin is digital gold. $DOM is a digital collar engineered specifically for financial domination and kink economies.</p>
              </div>
              
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Integrated Tribute Burn</h3>
                <p className="text-domtoken-silver">Every payment humiliates the sender with auto-burn taxes while decreasing circulating supply for scarcity.</p>
              </div>
              
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">No Centralized Bans</h3>
                <p className="text-domtoken-silver">No bank or app can ban your payments. Tribute is irreversible. Your obedience is permanent.</p>
              </div>
              
              <div className="bg-domtoken-slate/20 border border-domtoken-crimson/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-domtoken-crimson mb-2">Psychological Utility</h3>
                <p className="text-domtoken-silver">Access gates, humiliating ranks, and ritual mechanics that generic cryptocurrencies simply cannot provide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
