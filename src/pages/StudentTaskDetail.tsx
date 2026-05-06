import { useParams, useNavigate, Link } from 'react-router';
import { useStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, User, Timer, Play, CheckCircle, Send, Star, AlertTriangle, BookOpen, Calendar } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { useState } from 'react';

export default function StudentTaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const mentorTasks = useStore((s) => s.mentorTasks);
  const updateMentorTask = useStore((s) => s.updateMentorTask);
  const [submissionNote, setSubmissionNote] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const task = mentorTasks.find((t) => t.id === taskId);
  if (!task) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground text-lg">Task not found</p>
        <Link to="/app/workspace"><Button variant="outline" className="mt-4">Back to Workspace</Button></Link>
      </div>
    );
  }

  const isOverdue = isPast(new Date(task.deadline)) && task.status !== 'graded' && task.status !== 'submitted';
  const pomodoroSessions = Math.ceil(task.estimatedDuration / 25);
  const canSubmit = task.status === 'in-progress' || task.status === 'pending';

  const handleStartFocus = () => {
    if (task.status === 'pending') {
      updateMentorTask(task.id, { status: 'in-progress', progress: Math.max(task.progress, 10) });
    }
    navigate('/app/focus');
  };

  const handleSubmit = () => {
    updateMentorTask(task.id, { status: 'submitted', progress: 100, submissionNote: submissionNote || 'Task completed.', completedAt: new Date().toISOString() });
    setShowSubmitForm(false);
  };

  const handleUpdateProgress = (p: number) => {
    updateMentorTask(task.id, { progress: p, status: p > 0 ? 'in-progress' : 'pending' });
  };

  const statusBadge = (s: string) => {
    const m: Record<string, string> = { pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', 'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20', submitted: 'bg-purple-500/10 text-purple-400 border-purple-500/20', graded: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    const l: Record<string, string> = { pending: 'Pending', 'in-progress': 'In Progress', submitted: 'Submitted', graded: 'Graded' };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${m[s]}`}>{l[s]}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/app/workspace')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Back to Workspace
      </button>

      {/* Header Card */}
      <Card className="bg-card border-border rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-secondary"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${task.progress}%` }} /></div>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">{statusBadge(task.status)}<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{task.priority}</span></div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{task.title}</h1>
            <p className="text-muted-foreground">{task.subject}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetaBox icon={<User className="h-3.5 w-3.5" />} label="Assigned By" value={task.assignedBy} />
            <MetaBox icon={isOverdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />} label="Deadline" value={format(new Date(task.deadline), 'MMM d, h:mm a')} sub={formatDistanceToNow(new Date(task.deadline), { addSuffix: true })} warn={isOverdue} />
            <MetaBox icon={<Timer className="h-3.5 w-3.5" />} label="Duration" value={`${task.estimatedDuration} min`} sub={`${task.focusMinutesSpent} min spent`} />
            <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/20">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1"><BookOpen className="h-3.5 w-3.5" /> Pomodoros</div>
              <p className="text-sm font-semibold text-indigo-400">{pomodoroSessions} sessions</p>
              <p className="text-xs text-indigo-400/60 mt-0.5">Recommended</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-foreground">Progress</span><span className="text-sm font-bold text-indigo-400">{task.progress}%</span></div>
            <Progress value={task.progress} className="h-2.5" />
            {canSubmit && <div className="flex gap-2 pt-1">{[25, 50, 75, 100].map((p) => (<button key={p} onClick={() => handleUpdateProgress(p)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${task.progress >= p ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'}`}>{p}%</button>))}</div>}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-card border-border rounded-2xl"><CardContent className="p-6 md:p-8"><h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-400" />Instructions</h3><p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{task.description}</p></CardContent></Card>

      {/* Actions */}
      {canSubmit && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleStartFocus} className="flex-1 h-14 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 gap-2"><Play className="h-5 w-5" />Start Focus Session</Button>
          <Button onClick={() => setShowSubmitForm(true)} variant="outline" className="flex-1 h-14 text-base font-bold rounded-xl border-border gap-2"><Send className="h-5 w-5" />Mark Complete</Button>
        </div>
      )}

      {showSubmitForm && (
        <Card className="bg-card border-indigo-500/20 rounded-2xl"><CardContent className="p-6 space-y-4"><h3 className="text-lg font-semibold text-foreground">Submit Task</h3><div className="space-y-2"><Label>Submission Note (optional)</Label><Textarea placeholder="Add notes, links, or comments..." value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)} className="min-h-[100px] bg-secondary/50 border-border" /></div><div className="flex gap-3"><Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"><CheckCircle className="h-4 w-4" />Submit</Button><Button variant="ghost" onClick={() => setShowSubmitForm(false)}>Cancel</Button></div></CardContent></Card>
      )}

      {task.status === 'submitted' && (
        <Card className="bg-purple-500/5 border-purple-500/20 rounded-2xl"><CardContent className="p-6 space-y-2"><div className="flex items-center gap-2 text-purple-400 font-semibold"><Send className="h-5 w-5" />Submitted — Awaiting Review</div>{task.submissionNote && <p className="text-sm text-muted-foreground">Note: {task.submissionNote}</p>}{task.completedAt && <p className="text-xs text-muted-foreground">Completed {format(new Date(task.completedAt), 'MMM d, yyyy h:mm a')}</p>}</CardContent></Card>
      )}

      {task.status === 'graded' && (
        <Card className="bg-emerald-500/5 border-emerald-500/20 rounded-2xl"><CardContent className="p-6 md:p-8 space-y-5"><div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg"><Star className="h-5 w-5 fill-emerald-400" />Grades & Feedback</div><div className="grid sm:grid-cols-3 gap-4"><div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 text-center"><p className="text-3xl font-bold text-emerald-400">{task.marks}<span className="text-lg text-emerald-400/60">/{task.maxMarks}</span></p><p className="text-xs text-emerald-400/60 font-bold uppercase tracking-wider mt-1">Score</p></div><div className="bg-secondary/50 rounded-xl p-4 border border-border text-center"><p className="text-xl font-bold text-foreground">{task.focusMinutesSpent} min</p><p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Time Spent</p></div><div className="bg-secondary/50 rounded-xl p-4 border border-border text-center"><p className="text-xl font-bold text-foreground">{task.completedAt ? format(new Date(task.completedAt), 'MMM d') : '—'}</p><p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Completed</p></div></div>{task.feedback && <div className="bg-secondary/30 rounded-xl p-5 border border-border"><p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Mentor Feedback</p><p className="text-foreground leading-relaxed">{task.feedback}</p></div>}</CardContent></Card>
      )}
    </div>
  );
}

function MetaBox({ icon, label, value, sub, warn }: { icon: React.ReactNode; label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${warn ? 'bg-red-500/5 border-red-500/20' : 'bg-secondary/50 border-border'}`}>
      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 ${warn ? 'text-red-400' : 'text-muted-foreground'}`}>{icon} {label}</div>
      <p className={`text-sm font-semibold ${warn ? 'text-red-400' : 'text-foreground'}`}>{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${warn ? 'text-red-400/70' : 'text-muted-foreground'}`}>{sub}</p>}
    </div>
  );
}
