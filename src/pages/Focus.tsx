import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Timer, Flame, Award, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Focus() {
  const { addFocusTime, productivityScore } = useStore();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Session finished
      if (mode === 'pomodoro') {
        addFocusTime(25);
        // Maybe auto start break?
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, addFocusTime]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'pomodoro') setTimeLeft(25 * 60);
    if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const totalSeconds = mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mt-8">
        <h2 className="text-3xl font-bold tracking-tight">Deep Work Engine</h2>
        <p className="text-muted-foreground">Engage deeply. Do not disturb.</p>
      </div>

      <Card className="border border-border bg-card shadow-2xl overflow-hidden relative rounded-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary">
           <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
        
        <CardContent className="p-8 md:p-16 flex flex-col items-center relative z-10">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-8">Focus Session</p>
          <div className="flex gap-2 p-1 bg-secondary rounded-full mb-12 border border-border">
             <button
                onClick={() => switchMode('pomodoro')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'pomodoro' ? 'bg-primary shadow-sm text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
             >
               Pomodoro
             </button>
             <button
                onClick={() => switchMode('shortBreak')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'shortBreak' ? 'bg-emerald-600 shadow-sm text-white' : 'text-muted-foreground hover:text-foreground'}`}
             >
               Short Break
             </button>
             <button
                onClick={() => switchMode('longBreak')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'longBreak' ? 'bg-blue-600 shadow-sm text-white' : 'text-muted-foreground hover:text-foreground'}`}
             >
               Long Break
             </button>
          </div>

          <div className="text-[120px] font-bold tracking-tighter leading-none mb-12 font-mono text-foreground">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-4">
            <button 
              className={`px-8 py-4 rounded-full text-base font-bold transition-colors ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
              onClick={toggleTimer}
            >
              <div className="flex items-center">
                {isRunning ? <><Pause className="mr-2 h-5 w-5" /> Pause</> : <><Play className="mr-2 h-5 w-5" /> Start Focus</>}
              </div>
            </button>
            <button className="px-8 py-4 bg-secondary border border-border hover:bg-secondary/80 rounded-full text-base font-bold transition-colors" onClick={resetTimer}>
              <div className="flex items-center text-foreground">
                 <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-bold tracking-wider uppercase">Current Streak</p>
            <p className="text-xl font-bold text-foreground">2 Pomodoros</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-bold tracking-wider uppercase">XP Earned Today</p>
            <p className="text-xl font-bold text-foreground">+120 XP</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-bold tracking-wider uppercase">Productivity</p>
            <p className="text-xl font-bold text-foreground">{productivityScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
