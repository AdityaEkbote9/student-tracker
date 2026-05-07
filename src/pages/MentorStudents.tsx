import { useState } from 'react';
import { useStore, MentorTask } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Clock, CheckCircle, Star, X, Send, Timer, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

const statusConfig: Record<string, { label: string; color: string }> = {
  'pending': { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'submitted': { label: 'Submitted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  'graded': { label: 'Graded', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function MentorStudents() {
  const mentorTasks = useStore((s) => s.mentorTasks);
  const updateMentorTask = useStore((s) => s.updateMentorTask);
  const [gradingTask, setGradingTask] = useState<string | null>(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending' | 'in-progress' | 'graded'>('all');

  const filtered = filter === 'all' ? mentorTasks : mentorTasks.filter((t) => t.status === filter);

  const handleGrade = (taskId: string) => {
    if (!marks) return;
    updateMentorTask(taskId, {
      status: 'graded',
      marks: Number(marks),
      feedback: feedback || 'No additional feedback.',
    });
    setGradingTask(null);
    setMarks('');
    setFeedback('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
          <Users className="h-4 w-4" /> Student Progress
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Monitor & Grade</h2>
        <p className="text-muted-foreground">Track student progress and review submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl border border-border w-fit">
        {(['all', 'pending', 'in-progress', 'submitted', 'graded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f}
            {f === 'submitted' && <span className="ml-1.5 bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full text-xs">{mentorTasks.filter((t) => t.status === 'submitted').length}</span>}
          </button>
        ))}
      </div>

      {/* Task Table */}
      <Card className="bg-card border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Task</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Deadline</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const studentName = task.assignedTo.split('@')[0].charAt(0).toUpperCase() + task.assignedTo.split('@')[0].slice(1);
                const isOverdue = isPast(new Date(task.deadline)) && task.status !== 'graded' && task.status !== 'submitted';
                const st = statusConfig[task.status];

                return (
                  <tr key={task.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">{studentName.charAt(0)}</div>
                        <p className="font-semibold text-foreground text-sm">{studentName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${task.progress}%` }} /></div>
                        <span className="text-sm text-muted-foreground">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm ${isOverdue ? 'text-red-400' : 'text-foreground'}`}>
                        {isOverdue && <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />}
                        {format(new Date(task.deadline), 'MMM d, h:mm a')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      {task.status === 'submitted' ? (
                        <Button size="sm" onClick={() => { setGradingTask(task.id); setMarks(''); setFeedback(''); }} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1 rounded-lg">
                          <Star className="h-3.5 w-3.5" /> Grade
                        </Button>
                      ) : task.status === 'graded' ? (
                        <span className="text-sm font-semibold text-emerald-400">{task.marks}/{task.maxMarks}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No tasks match this filter.</div>
        )}
      </Card>

      {/* Grading Modal */}
      {gradingTask && (() => {
        const task = mentorTasks.find((t) => t.id === gradingTask);
        if (!task) return null;
        const studentName = task.assignedTo.split('@')[0].charAt(0).toUpperCase() + task.assignedTo.split('@')[0].slice(1);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setGradingTask(null)} />
            <Card className="relative z-10 w-full max-w-lg bg-card/95 backdrop-blur-xl border-border rounded-2xl shadow-2xl shadow-black/30">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">Grade Submission</h3>
                  <button onClick={() => setGradingTask(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 border border-border space-y-1">
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Student: {studentName} • {task.subject}</p>
                  {task.submissionNote && <p className="text-xs text-muted-foreground mt-2">Note: {task.submissionNote}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Marks (out of {task.maxMarks}) *</Label>
                  <Input type="number" min="0" max={task.maxMarks} placeholder={`0 — ${task.maxMarks}`} value={marks} onChange={(e) => setMarks(e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Feedback</Label>
                  <Textarea placeholder="Write feedback for the student..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="min-h-[80px] bg-secondary/50 border-border" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => handleGrade(gradingTask)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 flex-1"><CheckCircle className="h-4 w-4" />Save Grade</Button>
                  <Button variant="ghost" onClick={() => setGradingTask(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}
