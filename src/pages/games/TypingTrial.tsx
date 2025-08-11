import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TYPING_TIERS, TierConfig, TierCode } from '@/config/typingTrialConfig';
import { TYPING_TEXTS } from '@/data/typingTrialTexts';
import { cn } from '@/lib/utils';

interface ResultRecord {
  ts: number;
  tier: TierCode;
  wpm: number;
  accuracy: number; // 0-1
  score: number;
  timeTaken: number; // seconds
}

function pickTextForTier(tier: TierConfig): string {
  const pool = TYPING_TEXTS[tier.code] ?? [];
  if (!pool.length) return 'No text available.';
  const tl = tier.textLength;
  if (tl !== 'daily') {
    const filtered = pool.filter(t => t.length >= tl.min && t.length <= tl.max);
    const arr = filtered.length ? filtered : pool;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return pool[0];
}

function computeWpm(charsTyped: number, elapsedSec: number) {
  const words = charsTyped / 5;
  const minutes = Math.max(elapsedSec / 60, 1e-6);
  return words / minutes;
}

function computeAccuracy(target: string, input: string) {
  const len = input.length;
  if (len === 0) return 1;
  let correct = 0;
  for (let i = 0; i < len; i++) {
    if (input[i] === target[i]) correct++;
  }
  return correct / len;
}

function computeScore(wpm: number, wpmReq: number, accuracy: number, timeRemainingRatio: number, streakMult: number, perfectBonus: boolean) {
  const base = 100 * (wpm / Math.max(wpmReq, 1)) * (accuracy * accuracy) * (1 + 0.25 * timeRemainingRatio) * streakMult;
  return Math.round(base + (perfectBonus ? 100 : 0));
}

const STORAGE_KEYS = {
  unlocks: 'typingTrialUnlocks',
  results: 'typingTrialResults',
};

type UnlockMap = Record<TierCode, number>; // clears per tier

const initialUnlocks: UnlockMap = {
  recruit: 3, // unlocked by default as completed 3 to allow cadet if desired; set to 0 if strict
  cadet: 0,
  enlisted: 0,
  specialist: 0,
  operative: 0,
  elite: 0,
};

const FocusLossMax = 2;

const TypingTrial: React.FC = () => {
  // SEO minimal
  useEffect(() => {
    document.title = 'Typing Trial — Sub Camp Games';
    const descMeta = document.head.querySelector('meta[name="description"]') || (() => { const m = document.createElement('meta'); m.setAttribute('name','description'); document.head.appendChild(m); return m; })();
    descMeta.setAttribute('content', 'Type with speed and accuracy under pressure. Sub Camp Typing Trial — militarized precision.');
    const canonical = document.head.querySelector('link[rel="canonical"]') || (() => { const l = document.createElement('link'); l.setAttribute('rel','canonical'); document.head.appendChild(l); return l; })();
    (canonical as HTMLLinkElement).href = window.location.origin + '/games/typing-trial';
  }, []);

  const [stage, setStage] = useState<'start'|'play'|'result'>('start');
  const [selectedTier, setSelectedTier] = useState<TierCode>('recruit');
  const [unlocks, setUnlocks] = useState<UnlockMap>(() => {
    try { return { ...initialUnlocks, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.unlocks) || '{}') } as UnlockMap; } catch { return initialUnlocks; }
  });
  const [results, setResults] = useState<ResultRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.results) || '[]'); } catch { return []; }
  });

  // Gameplay state
  const [target, setTarget] = useState('');
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [focusLosses, setFocusLosses] = useState(0);
  const [streak, setStreak] = useState(0);
  const keystrokesRef = useRef<{ t: number; k: string }[]>([]);
  const rafRef = useRef<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  const tierCfg = useMemo(() => TYPING_TIERS.find(t => t.code === selectedTier)!, [selectedTier]);
  const timeLimit = useMemo(() => tierCfg.timeLimitSec === 'dynamic' ? Math.min(Math.max(Math.ceil((pickTextForTier(tierCfg).length/5) * 2), 45), 120) : tierCfg.timeLimitSec, [tierCfg]);
  const reqWpm = useMemo(() => tierCfg.reqWpm === 'dynamic' ? 70 : tierCfg.reqWpm, [tierCfg]);

  const elapsed = useMemo(() => (startedAt ? Math.max(0, (performance.now() - startedAt) / 1000) : 0), [startedAt, input, remaining]);
  const wpm = useMemo(() => computeWpm(input.length, elapsed), [input.length, elapsed]);
  const accuracy = useMemo(() => computeAccuracy(target, input), [target, input]);
  const errors = useMemo(() => Math.max(0, input.length - Math.round(input.length * accuracy)), [input.length, accuracy]);

  // Focus loss anti-cheat
  useEffect(() => {
    const onBlur = () => setFocusLosses(v => v + 1);
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  useEffect(() => {
    if (focusLosses >= FocusLossMax && stage === 'play') {
      finish(false);
    }
  }, [focusLosses, stage]);

  // Stage transitions
  const startGame = useCallback(() => {
    const text = pickTextForTier(tierCfg);
    setTarget(text);
    setInput('');
    setStartedAt(null);
    setRemaining(timeLimit);
    setFocusLosses(0);
    keystrokesRef.current = [];
    setStage('play');
  }, [tierCfg, timeLimit]);

  const stopRaf = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };

  const tick = useCallback(() => {
    if (!startedAt) return;
    const now = performance.now();
    const elapsedSec = (now - startedAt) / 1000;
    const rem = Math.max(0, timeLimit - elapsedSec);
    setRemaining(rem);
    if (rem <= 0) {
      stopRaf();
      finish(false);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [startedAt, timeLimit]);

  const beginIfNeeded = () => {
    if (!startedAt) {
      const s = performance.now();
      setStartedAt(s);
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => () => stopRaf(), []);

  const onInputChange = (val: string) => {
    if (val.length > target.length) return; // no extra chars beyond target
    beginIfNeeded();
    setInput(val);
    const t = startedAt ? performance.now() - startedAt : 0;
    keystrokesRef.current.push({ t, k: val[val.length - 1] || '' });
    if (val === target) {
      finish(true);
    }
  };

  const [lastResult, setLastResult] = useState<ResultRecord | null>(null);

  const finish = (completed: boolean) => {
    stopRaf();
    const elapsedSec = startedAt ? (performance.now() - startedAt) / 1000 : 0;
    const acc = computeAccuracy(target, input);
    const wordsPerMin = computeWpm(input.length, elapsedSec);
    const timeRemRatio = Math.max(0, remaining / timeLimit);
    const passed = completed && wordsPerMin >= reqWpm && acc >= tierCfg.minAccuracy;
    const streakMult = 1 + Math.min(streak, 5) * 0.1;
    const score = computeScore(wordsPerMin, reqWpm, acc, timeRemRatio, streakMult, acc === 1);

    if (passed) setStreak(s => Math.min(s + 1, 5)); else setStreak(0);

    // unlocks
    const newUnlocks: UnlockMap = { ...unlocks };
    if (passed) {
      newUnlocks[selectedTier] = (newUnlocks[selectedTier] || 0) + 1;
      const order = TYPING_TIERS.map(t => t.code);
      const idx = order.indexOf(selectedTier);
      if (idx >= 0 && idx < order.length - 1 && newUnlocks[selectedTier] >= 3) {
        // next tier stays counted via its own key; we just allow selection by checking previous clears
      }
    }
    setUnlocks(newUnlocks);
    localStorage.setItem(STORAGE_KEYS.unlocks, JSON.stringify(newUnlocks));

    const rec: ResultRecord = { ts: Date.now(), tier: selectedTier, wpm: Math.round(wordsPerMin), accuracy: acc, score, timeTaken: Math.round(elapsedSec) };
    const nextResults = [rec, ...results].slice(0, 20);
    setResults(nextResults);
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(nextResults));

    setLastResult(rec);
    setStage('result');
  };

  const clearsFor = (code: TierCode) => unlocks[code] || 0;
  const isLocked = (code: TierCode) => {
    if (code === 'recruit') return false;
    const order = TYPING_TIERS.map(t => t.code);
    const idx = order.indexOf(code);
    const prev = order[idx - 1];
    return (unlocks[prev as TierCode] || 0) < 3;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-stencil text-3xl md:text-4xl tracking-widest uppercase">Obedience Drill: Typing Trial</h1>
      </header>

      {stage === 'start' && (
        <main>
          <section className="mb-8" aria-label="Tier Selection">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TYPING_TIERS.map(t => {
                    const locked = isLocked(t.code);
                    const clears = clearsFor(t.code);
                    return (
                      <button
                        key={t.code}
                        disabled={locked}
                        onClick={() => setSelectedTier(t.code)}
                        className={cn(
                          'obsidian-card p-4 text-left border-2',
                          selectedTier === t.code ? 'border-accent' : 'border-border',
                          locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent'
                        )}
                        aria-pressed={selectedTier === t.code}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{t.name}</span>
                          {locked ? <Badge variant="destructive">Locked</Badge> : <Badge variant="outline">Clears: {clears}</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t.textLength === 'daily' ? 'Daily curated paragraph' : `${t.textLength.min}-${t.textLength.max} chars`} · WPM ≥ {t.reqWpm === 'dynamic' ? 'dyn' : t.reqWpm} · Acc ≥ {Math.round(t.minAccuracy*100)}% · Time {t.timeLimitSec === 'dynamic' ? 'dyn' : `${t.timeLimitSec}s`}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button onClick={startGame}>Begin Drill</Button>
                  <Link to="/compete"><Button variant="outline">Back to Compete</Button></Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Local Leaderboard */}
          <section aria-label="Local Leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Local Leaderboard (MVP)</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No runs yet. Complete a drill to see results.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.slice(0,8).map((r,i) => (
                      <div key={i} className="flex items-center justify-between obsidian-card p-3">
                        <div className="text-sm">{new Date(r.ts).toLocaleString()}</div>
                        <div className="text-sm">{r.tier.toUpperCase()}</div>
                        <div className="text-sm">{r.wpm} WPM</div>
                        <div className="text-sm">{Math.round(r.accuracy*100)}%</div>
                        <div className="text-sm font-semibold">{r.score}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      )}

      {stage === 'play' && (
        <main>
          <section aria-label="Typing Arena">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tierCfg.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div>WPM <span className="font-semibold">{Math.round(wpm)}</span></div>
                    <div>Acc <span className="font-semibold">{Math.round(accuracy*100)}%</span></div>
                    <div>Errors <span className="font-semibold text-destructive">{errors}</span></div>
                    <div>Time <span className="font-semibold">{Math.ceil(remaining)}s</span></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted/30 border-2 border-border">
                  <p className="font-mono text-lg leading-relaxed select-none">
                    {target.split('').map((ch, idx) => {
                      const typed = input[idx];
                      const state = typed == null ? 'pending' : (typed === ch ? 'correct' : 'wrong');
                      return (
                        <span key={idx} className={cn(
                          state === 'correct' && 'text-foreground',
                          state === 'wrong' && 'text-destructive',
                          state === 'pending' && 'text-muted-foreground'
                        )}>{ch}</span>
                      );
                    })}
                  </p>
                </div>

                <textarea
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  className="w-full h-32 obsidian-input p-3 font-mono text-base"
                  placeholder="Begin typing here. Pasting is disabled."
                  aria-label="Typing input"
                />
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" onClick={() => setStage('start')}>Quit</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      )}

      {stage === 'result' && lastResult && (
        <main>
          <section aria-label="Results">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div><div className="text-xs text-muted-foreground">Tier</div><div className="font-semibold">{tierCfg.name}</div></div>
                  <div><div className="text-xs text-muted-foreground">WPM</div><div className="font-semibold">{lastResult.wpm}</div></div>
                  <div><div className="text-xs text-muted-foreground">Accuracy</div><div className="font-semibold">{Math.round(lastResult.accuracy*100)}%</div></div>
                  <div><div className="text-xs text-muted-foreground">Time</div><div className="font-semibold">{lastResult.timeTaken}s</div></div>
                  <div><div className="text-xs text-muted-foreground">Score</div><div className="font-semibold">{lastResult.score}</div></div>
                </div>

                <div className="mb-6">
                  {lastResult.accuracy === 1 && (
                    <div className="text-sm text-success">Perfect accuracy bonus +100</div>
                  )}
                  {lastResult.wpm >= reqWpm && lastResult.accuracy >= tierCfg.minAccuracy ? (
                    <p className="text-base font-semibold">Verdict: Clearance achieved. Proceed when ordered.</p>
                  ) : (
                    <p className="text-base font-semibold text-destructive">Verdict: Standards not met. Again.</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => startGame()}>Play Again</Button>
                  <Button variant="secondary" onClick={() => { setStage('start'); }}>Tier Select</Button>
                  <Link to="/compete"><Button variant="outline">Back to Compete</Button></Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      )}
    </div>
  );
};

export default TypingTrial;
