import { useStore } from '@/store';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, TrendingUp, Award, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentGrades() {
  const user = useStore((s) => s.user);
  const mentorTasks = useStore((s) => s.mentorTasks);
  const gradedTasks = mentorTasks.filter((t) => t.assignedTo === user?.email && t.status === 'graded');

  const totalMarks = gradedTasks.reduce((sum, t) => sum + (t.marks || 0), 0);
  const totalMax = gradedTasks.reduce((sum, t) => sum + t.maxMarks, 0);
  const avgPercent = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(0) : '—';
  const totalFocusTime = gradedTasks.reduce((sum, t) => sum + t.focusMinutesSpent, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/app/workspace">
          <Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Grades & Feedback</h2>
          <p className="text-muted-foreground">Performance overview from your mentors</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Graded', value: gradedTasks.length, icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Total Score', value: `${totalMarks}/${totalMax}`, icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Average', value: `${avgPercent}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Focus Time', value: `${totalFocusTime}m`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
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

      {/* Graded Tasks */}
      {gradedTasks.length > 0 ? (
        <div className="space-y-4">
          {gradedTasks.map((task) => {
            const scorePercent = task.maxMarks > 0 ? ((task.marks || 0) / task.maxMarks) * 100 : 0;
            const scoreColor = scorePercent >= 80 ? 'text-emerald-400' : scorePercent >= 60 ? 'text-amber-400' : 'text-red-400';
            return (
              <Link to={`/app/workspace/${task.id}`} key={task.id}>
                <Card className="bg-card border-border hover:border-indigo-500/30 transition-all rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5 mb-4">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-foreground">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.subject} • {task.assignedBy}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${scoreColor}`}>{task.marks}<span className="text-sm opacity-60">/{task.maxMarks}</span></p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{task.focusMinutesSpent}m</p>
                          <p className="text-xs text-muted-foreground">Focus</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{task.completedAt ? format(new Date(task.completedAt), 'MMM d') : '—'}</p>
                          <p className="text-xs text-muted-foreground">Date</p>
                        </div>
                      </div>
                    </div>
                    {task.feedback && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Feedback</p>
                        <p className="text-sm text-muted-foreground">{task.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Award className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No graded tasks yet</p>
        </div>
      )}
    </div>
  );
}
