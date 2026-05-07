import { useStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, Clock, Target, Zap } from 'lucide-react';

const WEEKLY_DATA = [
  { name: 'Mon', focus: 120, tasks: 4 },
  { name: 'Tue', focus: 180, tasks: 6 },
  { name: 'Wed', focus: 90, tasks: 3 },
  { name: 'Thu', focus: 240, tasks: 8 },
  { name: 'Fri', focus: 150, tasks: 5 },
  { name: 'Sat', focus: 45, tasks: 1 },
  { name: 'Sun', focus: 60, tasks: 2 },
];

const SUBJECT_DATA = [
  { name: 'Adv. Calculus', value: 35, color: '#3b82f6' },
  { name: 'Neurobiology', value: 25, color: '#10b981' },
  { name: 'Macroeconomics', value: 20, color: '#f59e0b' },
  { name: 'Quantum Physics', value: 20, color: '#8b5cf6' },
];

export default function Analytics() {
  const { focusTimeTotal, productivityScore, streak, tasks, goals } = useStore();

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your productivity and learning patterns.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(focusTimeTotal / 60)}h {focusTimeTotal % 60}m</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivityScore}/100</div>
            <p className="text-xs text-muted-foreground mt-1">{"Top 15% of users"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCompletionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{completedTasks} of {totalTasks} tasks done</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Consistency Map</CardTitle>
            <CardDescription>A visual cryptographic ledger of your existence</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsistencyMap />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>Focus time breakdown by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SUBJECT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SUBJECT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15,15,24,0.95)', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', backdropFilter: 'blur(16px)', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.3)' }}
                    itemStyle={{ color: '#f0f0f5' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Productivity Goals</CardTitle>
            <CardDescription>Track your progress against weekly targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Study target', actual: 40, target: 50 },
                    { name: 'Tasks completed', actual: 23, target: 30 },
                    { name: 'Deep work sessions', actual: 8, target: 10 },
                    { name: 'Reviews done', actual: 4, target: 5 },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-muted/30" />
                  <XAxis type="number" className="text-xs" tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <YAxis dataKey="name" type="category" className="text-xs" width={100} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15,15,24,0.95)', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', backdropFilter: 'blur(16px)', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.3)' }}
                    itemStyle={{ color: '#f0f0f5' }}
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="#10b981" name="Actual Progress" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" fill="#6366f1" opacity={0.3} name="Weekly Target" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
           <CardHeader>
               <div className="flex items-center justify-between">
                 <div>
                   <CardTitle>Peak Focus Hours</CardTitle>
                   <CardDescription>Activity heat map showing your most productive times</CardDescription>
                 </div>
                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                   <span>Less</span>
                   {[0.05, 0.15, 0.35, 0.6, 1].map((opacity, i) => (
                     <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: `rgba(99, 102, 241, ${opacity})` }} />
                   ))}
                   <span>More</span>
                 </div>
               </div>
           </CardHeader>
           <CardContent>
             <HeatmapGrid />
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Heatmap data: intensity 0-4 for each hour slot per day
const HEATMAP_DATA: Record<string, number[]> = {
  Mon: [0, 3, 4, 4, 2, 0, 0, 1, 0, 2, 1, 0],
  Tue: [0, 0, 3, 3, 0, 0, 1, 0, 2, 0, 0, 0],
  Wed: [1, 0, 4, 3, 0, 0, 0, 1, 2, 3, 4, 0],
  Thu: [0, 2, 3, 4, 3, 1, 0, 0, 1, 2, 0, 0],
  Fri: [0, 1, 4, 4, 2, 0, 1, 0, 0, 1, 0, 0],
  Sat: [0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  Sun: [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
};

const HOURS = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const INTENSITY_MAP: Record<number, string> = {
  0: 'rgba(99, 102, 241, 0.05)',
  1: 'rgba(99, 102, 241, 0.15)',
  2: 'rgba(99, 102, 241, 0.35)',
  3: 'rgba(99, 102, 241, 0.6)',
  4: 'rgba(99, 102, 241, 1)',
};

function HeatmapGrid() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Hour labels */}
        <div className="flex items-center mb-2">
          <div className="w-12 shrink-0" />
          {HOURS.map((h) => (
            <div key={h} className="flex-1 text-center text-xs text-muted-foreground font-medium">{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-1.5">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-0">
              <div className="w-12 shrink-0 text-xs font-semibold text-muted-foreground">{day}</div>
              <div className="flex-1 flex gap-1">
                {HEATMAP_DATA[day].map((intensity, i) => (
                  <div
                    key={i}
                    className="flex-1 h-7 rounded-sm transition-colors hover:ring-1 hover:ring-indigo-400/50 cursor-default"
                    style={{ backgroundColor: INTENSITY_MAP[intensity] }}
                    title={`${day} ${HOURS[i]} — ${intensity === 0 ? 'No activity' : intensity === 1 ? 'Light' : intensity === 2 ? 'Moderate' : intensity === 3 ? 'High' : 'Peak'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Generate consistency map data — ~365 days, 7 rows x 52 cols
function generateConsistencyData(): number[][] {
  const rows = 7; // days of week
  const cols = 52; // weeks
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      // Mostly empty (0), with scattered activity
      const rand = Math.random();
      if (c < 46) {
        // Past weeks: mostly empty with some scattered marks
        if (rand < 0.88) row.push(0);
        else if (rand < 0.93) row.push(1);
        else if (rand < 0.96) row.push(2);
        else if (rand < 0.985) row.push(3);
        else row.push(4);
      } else if (c >= 49) {
        // Recent weeks: more activity
        if (rand < 0.5) row.push(0);
        else if (rand < 0.65) row.push(1);
        else if (rand < 0.78) row.push(2);
        else if (rand < 0.9) row.push(3);
        else row.push(4);
      } else {
        // Middle weeks
        if (rand < 0.7) row.push(0);
        else if (rand < 0.82) row.push(1);
        else if (rand < 0.9) row.push(2);
        else if (rand < 0.96) row.push(3);
        else row.push(4);
      }
    }
    grid.push(row);
  }
  return grid;
}

const CONSISTENCY_GRID = generateConsistencyData();
const CONSISTENCY_COLORS: Record<number, string> = {
  0: 'rgba(255,255,255, 0.04)',
  1: 'rgba(239, 68, 68, 0.5)',   // red — failure
  2: 'rgba(161, 98, 7, 0.6)',    // dark amber
  3: 'rgba(16, 185, 129, 0.5)',  // teal/green
  4: 'rgba(16, 185, 129, 0.9)',  // bright green — apex
};

function ConsistencyMap() {
  return (
    <div className="space-y-3">
      <div className="bg-secondary/30 rounded-xl border border-border p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex flex-col gap-[3px]">
            {CONSISTENCY_GRID.map((row, r) => (
              <div key={r} className="flex gap-[3px]">
                {row.map((val, c) => (
                  <div
                    key={c}
                    className="w-[10px] h-[10px] rounded-[2px]"
                    style={{ backgroundColor: CONSISTENCY_COLORS[val] }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground/50 italic">Learn to read the matrix.</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Failure</span>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(161, 98, 7, 0.6)' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)' }} />
          <span>Apex</span>
        </div>
      </div>
    </div>
  );
}
