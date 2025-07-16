
import React, { useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const tokenomicsData = [
  { name: 'Community & Rewards', value: 40, color: '#920000' },
  { name: 'Core Contributors & Team', value: 20, color: '#CCCCCC' },
  { name: 'Strategic Partners & Advisors', value: 20, color: '#4D4D4D' },
  { name: 'Ecosystem Fund', value: 15, color: '#666666' },
  { name: 'Public Sale & Liquidity', value: 5, color: '#919191' }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-domtoken-slate p-3 rounded-md border border-domtoken-slate/80 shadow-lg">
        <p className="font-bold text-white">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const TokenomicsSection: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <section id="tokenomics" className="py-24 bg-gradient-to-b from-domtoken-obsidian to-domtoken-slate/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cinzel">
            🐛 WHO SHOULD <span className="text-domtoken-crimson">APPLY</span>?
          </h2>
          <div className="text-lg text-domtoken-silver max-w-3xl mx-auto space-y-4">
            <p>You shouldn't.<br />But if you must:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Those who crave order in chaos</h3>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Those who ache to be claimed</h3>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Those who dream of chains, but fear the lock</h3>
          </div>
          <div className="bg-domtoken-slate/20 border border-domtoken-slate/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-domtoken-crimson mb-3">Those who know their place — and need it reinforced</h3>
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg text-domtoken-silver space-y-2">
            <p>You don't join MAGAT University.</p>
            <p>You confess your need for it.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
