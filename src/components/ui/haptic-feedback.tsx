import React from 'react';

// Haptic feedback utilities for mobile devices
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  },
  
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 25, 50]);
    }
  },
  
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  },
  
  notification: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }
};

// HOC to add haptic feedback to buttons
interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'notification';
  children: React.ReactNode;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  hapticType = 'light',
  onClick,
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    hapticFeedback[hapticType]();
    onClick?.(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`${props.className || ''} transition-all duration-150 active:scale-95`}
    >
      {children}
    </button>
  );
};

// Hook for haptic feedback
export const useHapticFeedback = () => {
  const triggerHaptic = (type: keyof typeof hapticFeedback) => {
    hapticFeedback[type]();
  };

  return { triggerHaptic };
};