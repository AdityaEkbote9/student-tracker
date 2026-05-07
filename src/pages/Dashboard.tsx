import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Timer, Target, CheckSquare, BrainCircuit, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const studyData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3.5 },
  { day: 'Wed', hours: 2.5 },
  { day: 'Thu', hours: 5 },
  { day: 'Fri', hours: 4 },
  { day: 'Sat', hours: 6 },
  { day: 'Sun', hours: 3 },
];

export default function Dashboard() {
  const { productivityScore, streak, focusTimeTotal, tasks, goals } = useStore();
  
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <div className="space-y-8 relative">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ambient-glow rounded-full pointer-events-none -z-10" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">Here's your productivity snapshot for today.</p>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Hero Card: Productivity Score */}
        <Card className="hover:-translate-y-0.5 transition-all duration-300 shadow-[0_0_30px_rgba(124,58,237,0.35)] relative overflow-hidden z-10 border-indigo-500/30 bg-[#0F172A]/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productivity Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-dashboard">{productivityScore}</span>
                  <span className="text-sm font-medium text-emerald-400">+4%</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Activity className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            {/* Animated Gradient Bar */}
            <div className="h-2 w-full bg-secondary/30 rounded-full mt-4 overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-dashboard animate-glow-pulse rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${productivityScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deep Work</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold">{Math.floor(focusTimeTotal / 60)}h {focusTimeTotal % 60}m</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Timer className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded w-fit border border-emerald-500/20">
              Your best focus week!
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Habit Streak</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold">{streak}</span>
                  <span className="text-sm font-medium text-muted-foreground">days</span>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex gap-1">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                 <div key={i} className={`flex-1 h-2 rounded-full ${i <= 6 ? 'bg-orange-500' : 'bg-white/10'}`} />
               ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-0.5 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Due</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold">{pendingTasks}</span>
                  <span className="text-sm font-medium text-muted-foreground">pending</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <CheckSquare className="h-6 w-6 text-blue-400" />
              </div>
            </div>
             <p className="mt-4 text-sm font-medium text-muted-foreground">
              {completedTasks} completed today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Study Hours</CardTitle>
            <CardDescription className="text-muted-foreground">Your weekly focus distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4 [&_.recharts-area-line]:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(16px)', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.3)' }}
                    itemStyle={{ color: '#f0f0f5' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#06B6D4" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                    activeDot={{ r: 6, fill: '#06B6D4', stroke: '#0F172A', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
            <CardDescription className="text-muted-foreground">Track your semester objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map(goal => {
               const percentage = Math.min(100, Math.round((goal.progress / goal.target) * 100));
               return (
                 <div key={goal.id} className="space-y-2">
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-medium text-foreground">{goal.name}</span>
                     <span className="font-mono text-muted-foreground">{percentage}%</span>
                   </div>
                   <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                     <div 
                       className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                       style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
                     />
                   </div>
                 </div>
               )
            })}
            
            <div className="pt-4 border-t border-border">
               {/* AI Insight Card */}
               <div className="flex items-center gap-4 bg-[#0F172A]/80 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden group">
                 {/* Shimmer effect */}
                 <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                 
                 <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <BrainCircuit className="h-5 w-5 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                 </div>
                 <div>
                   <p className="text-sm font-semibold text-cyan-100">AI Insight</p>
                   <p className="text-xs text-cyan-100/70 mt-0.5">You're slightly behind on DSA. Try allocating 2 more hours this weekend.</p>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
