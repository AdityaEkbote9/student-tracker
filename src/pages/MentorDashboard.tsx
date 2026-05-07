import { useStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ClipboardList, CheckCircle, Clock, TrendingUp, Star, Send } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';

export default function MentorDashboard() {
  const mentorTasks = useStore((s) => s.mentorTasks);

  const uniqueStudents = [...new Set(mentorTasks.map((t) => t.assignedTo))];
  const totalTasks = mentorTasks.length;
  const pendingReviews = mentorTasks.filter((t) => t.status === 'submitted').length;
  const completedTasks = mentorTasks.filter((t) => t.status === 'graded').length;
  const avgCompletion = totalTasks > 0
    ? Math.round(mentorTasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks)
    : 0;

  const recentActivity = [...mentorTasks]
    .filter((t) => t.status === 'submitted' || t.status === 'graded')
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  // Per-student stats
  const studentStats = uniqueStudents.map((email) => {
    const tasks = mentorTasks.filter((t) => t.assignedTo === email);
    const graded = tasks.filter((t) => t.status === 'graded');
    const avgScore = graded.length > 0 ? (graded.reduce((s, t) => s + (t.marks || 0), 0) / graded.length).toFixed(1) : '—';
    const avgProg = tasks.length > 0 ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length) : 0;
    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    return { email, name, totalTasks: tasks.length, avgScore, avgProgress: avgProg, pending: tasks.filter((t) => t.status === 'submitted').length };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
          <Users className="h-4 w-4" /> Mentor Dashboard
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground">Monitor student performance and manage assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: uniqueStudents.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Tasks Assigned', value: totalTasks, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Avg Completion', value: `${avgCompletion}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending Reviews', value: pendingReviews, icon: Clock, color: pendingReviews > 0 ? 'text-amber-400' : 'text-muted-foreground', bg: pendingReviews > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-secondary/50 border-border' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
            <div className={`p-3 rounded-xl border ${s.bg}`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student Overview Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Students</h3>
        <Card className="bg-card border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tasks</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Progress</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg Score</th>
                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending</th>
                </tr>
              </thead>
              <tbody>
                {studentStats.map((s) => (
                  <tr key={s.email} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">{s.name.charAt(0)}</div>
                        <div><p className="font-semibold text-foreground text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{s.totalTasks}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.avgProgress}%` }} /></div>
                        <span className="text-sm text-muted-foreground">{s.avgProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{s.avgScore}</td>
                    <td className="px-6 py-4">{s.pending > 0 ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">{s.pending} to review</span> : <span className="text-xs text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((task) => {
              const studentName = task.assignedTo.split('@')[0].charAt(0).toUpperCase() + task.assignedTo.split('@')[0].slice(1);
              return (
                <div key={task.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between gap-4 hover:border-indigo-500/20 transition-all duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border ${task.status === 'submitted' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                      {task.status === 'submitted' ? <Send className="h-4 w-4 text-purple-400" /> : <CheckCircle className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{studentName} — {task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.status === 'submitted' ? 'Submitted for review' : `Graded: ${task.marks}/${task.maxMarks}`}</p>
                    </div>
                  </div>
                  {task.completedAt && <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
