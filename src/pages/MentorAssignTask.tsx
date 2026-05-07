import { useState } from 'react';
import { useStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, CheckCircle, Timer, BookOpen } from 'lucide-react';

const studentOptions = [
  { name: 'Rahul', email: 'student@ascendos.com' },
  { name: 'Priya', email: 'priya@ascendos.com' },
  { name: 'Amit', email: 'amit@ascendos.com' },
  { name: 'Sneha', email: 'sneha@ascendos.com' },
  { name: 'All Students', email: 'all' },
];

export default function MentorAssignTask() {
  const user = useStore((s) => s.user);
  const addMentorTask = useStore((s) => s.addMentorTask);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [student, setStudent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const pomodoroSessions = duration ? Math.ceil(Number(duration) / 25) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !student || !deadline || !duration || !maxMarks) return;

    const targets = student === 'all' ? studentOptions.filter((s) => s.email !== 'all') : [studentOptions.find((s) => s.email === student)!];

    targets.forEach((t) => {
      addMentorTask({
        id: `mt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        description,
        subject: subject || 'General',
        assignedBy: user?.name || 'Mentor',
        assignedTo: t.email,
        deadline: new Date(deadline).toISOString(),
        priority,
        estimatedDuration: Number(duration),
        maxMarks: Number(maxMarks),
        status: 'pending',
        progress: 0,
        focusMinutesSpent: 0,
      });
    });

    setSuccess(true);
    setTitle(''); setDescription(''); setSubject(''); setStudent(''); setDeadline(''); setDuration(''); setMaxMarks('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider">
          <ClipboardList className="h-4 w-4" /> Assign Task
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create Assignment</h2>
        <p className="text-muted-foreground">Assign a new task to your students</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-400 animate-fade-in-up">
          <CheckCircle className="h-5 w-5" />
          <span className="font-semibold">Task assigned successfully!</span>
        </div>
      )}

      <Card className="bg-card border-border rounded-2xl">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="task-title">Task Title *</Label>
                <Input id="task-title" placeholder="e.g. DSA Assignment 3 — Graph Traversal" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="task-desc">Description & Instructions *</Label>
                <Textarea id="task-desc" placeholder="Detailed instructions for the student..." value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-[120px] bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-subject">Subject</Label>
                <Input id="task-subject" placeholder="e.g. Data Structures" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2">
                <Label>Assign To *</Label>
                <Select value={student} onValueChange={setStudent}>
                  <SelectTrigger className="bg-secondary/50 border-border"><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {studentOptions.map((s) => (
                      <SelectItem key={s.email} value={s.email}>{s.name} {s.email !== 'all' && <span className="text-muted-foreground ml-1">({s.email})</span>}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-deadline">Deadline *</Label>
                <Input id="task-deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="bg-secondary/50 border-border" />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as 'High' | 'Medium' | 'Low')}>
                  <SelectTrigger className="bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">🔴 High</SelectItem>
                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                    <SelectItem value="Low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-duration">Estimated Duration (minutes) *</Label>
                <Input id="task-duration" type="number" min="1" placeholder="e.g. 120" value={duration} onChange={(e) => setDuration(e.target.value)} required className="bg-secondary/50 border-border" />
                {pomodoroSessions > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-1">
                    <Timer className="h-3.5 w-3.5" />
                    <span>≈ {pomodoroSessions} Pomodoro sessions for student</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-marks">Max Marks *</Label>
                <Input id="task-marks" type="number" min="1" placeholder="e.g. 10" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} required className="bg-secondary/50 border-border" />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button type="submit" className="h-12 px-8 text-base font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 gap-2">
                <ClipboardList className="h-5 w-5" />
                Assign Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
