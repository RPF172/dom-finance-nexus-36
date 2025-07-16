
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tokenomics & Distribution</h2>
          <p className="text-domtoken-silver max-w-2xl mx-auto">
            $DOM has a total supply of 1 billion tokens, strategically allocated to ensure 
            sustainable growth and community-driven governance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={chartRef} className="w-full h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenomicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {tokenomicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Token Allocation</h3>
            <div className="space-y-6">
              {tokenomicsData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-4" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-domtoken-silver">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-domtoken-slate/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${item.value}%`, 
                          backgroundColor: item.color 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-domtoken-slate/30 rounded-lg border border-domtoken-slate/50">
              <h4 className="text-xl font-bold mb-4 text-domtoken-crimson">Vesting Schedule</h4>
              <p className="text-domtoken-silver mb-4">
                Team & Core Contributor tokens are subject to a 4-year vesting period with a 1-year cliff, 
                ensuring long-term alignment with project success.
              </p>
              <p className="text-domtoken-silver">
                Strategic Partners receive tokens with milestone-based unlock schedules, while Community 
                & Rewards tokens are distributed according to platform engagement metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
