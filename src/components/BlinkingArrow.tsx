import React from 'react';

const BlinkingArrow = () => {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <div className="text-domtoken-silver/30 text-2xl font-mono animate-pulse">
        &gt;&gt;
      </div>
    </div>
  );
};

export default BlinkingArrow;