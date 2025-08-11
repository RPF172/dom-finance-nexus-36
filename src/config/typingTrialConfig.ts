export type TierCode = 'recruit' | 'cadet' | 'enlisted' | 'specialist' | 'operative' | 'elite';

export interface TierConfig {
  code: TierCode;
  name: string;
  textLength: { min: number; max: number } | 'daily';
  reqWpm: number | 'dynamic';
  minAccuracy: number; // 0-1
  timeLimitSec: number | 'dynamic';
}

export const TYPING_TIERS: TierConfig[] = [
  { code: 'recruit', name: 'Recruit', textLength: { min: 30, max: 50 }, reqWpm: 25, minAccuracy: 0.94, timeLimitSec: 20 },
  { code: 'cadet', name: 'Cadet', textLength: { min: 60, max: 100 }, reqWpm: 35, minAccuracy: 0.95, timeLimitSec: 30 },
  { code: 'enlisted', name: 'Enlisted', textLength: { min: 120, max: 180 }, reqWpm: 45, minAccuracy: 0.96, timeLimitSec: 45 },
  { code: 'specialist', name: 'Specialist', textLength: { min: 180, max: 260 }, reqWpm: 55, minAccuracy: 0.97, timeLimitSec: 60 },
  { code: 'operative', name: 'Operative', textLength: { min: 260, max: 360 }, reqWpm: 65, minAccuracy: 0.98, timeLimitSec: 75 },
  { code: 'elite', name: 'Elite (Daily)', textLength: 'daily', reqWpm: 'dynamic', minAccuracy: 0.98, timeLimitSec: 'dynamic' },
];
