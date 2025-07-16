
import React, { useState, useEffect } from 'react';

interface CounterProps {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ 
  end, 
  label, 
  prefix = '', 
  suffix = '', 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (end - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-domtoken-silver">{label}</div>
    </div>
  );
};

const StatsCounter: React.FC = () => {
  return (
    <section className="py-12 bg-domtoken-slate/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Counter end={2500} label="Token Holders" />
          <Counter end={30} prefix="$" suffix="B+" label="Market Potential" />
          <Counter end={15} label="Governance Proposals" />
          <Counter end={65} suffix="%" label="Tokens Staked" />
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
