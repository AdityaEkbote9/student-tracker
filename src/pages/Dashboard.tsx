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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">Here's your productivity snapshot for today.</p>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productivity Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold">{productivityScore}</span>
                  <span className="text-sm font-medium text-emerald-400">+4%</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <Activity className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <Progress value={productivityScore} className="h-2 mt-4" />
          </CardContent>
        </Card>

        <Card>
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

        <Card>
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

        <Card>
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
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Area type="monotone" dataKey="hours" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
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
                   <Progress value={percentage} className="h-2" />
                 </div>
               )
            })}
            
            <div className="pt-4 border-t border-border">
               <div className="flex items-center gap-4 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                 <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                    <BrainCircuit className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="text-sm font-semibold text-indigo-100">AI Insight</p>
                   <p className="text-xs text-indigo-300/80 mt-0.5">You're slightly behind on DSA. Try allocating 2 more hours this weekend.</p>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
