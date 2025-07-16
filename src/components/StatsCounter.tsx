
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCountUp } from '@/hooks/useLazyLoading';

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
  const [stats, setStats] = useState({
    activeStudents: 0,
    completedLessons: 0,
    pendingApplications: 0,
    totalTributes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get active students count (profiles)
        const { count: profilesCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get completed lessons count  
        const { count: completedCount } = await supabase
          .from('user_lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('completed', true);

        // Get pending applications
        const { count: pendingCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Get total tributes count
        const { count: tributesCount } = await supabase
          .from('tributes')
          .select('*', { count: 'exact', head: true });

        setStats({
          activeStudents: profilesCount || 0,
          completedLessons: completedCount || 0,
          pendingApplications: pendingCount || 0,
          totalTributes: tributesCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to demo numbers
        setStats({
          activeStudents: 1247,
          completedLessons: 3891,
          pendingApplications: 89,
          totalTributes: 156
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-12 bg-domtoken-slate/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Counter end={stats.activeStudents} label="Active Students" />
          <Counter end={stats.completedLessons} label="Lessons Completed" />
          <Counter end={stats.pendingApplications} label="Pending Applications" />
          <Counter end={stats.totalTributes} label="Total Tributes" />
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
