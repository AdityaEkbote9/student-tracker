import { useStore, MentorTask } from '@/store';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Timer, AlertTriangle, CheckCircle, Send, Star, GraduationCap, BookOpen } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

const statusConfig = {
  'pending': { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'submitted': { label: 'Submitted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  'graded': { label: 'Graded', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

const priorityConfig = {
  'High': { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  'Medium': { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  'Low': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default function StudentWorkspace() {
  const user = useStore((s) => s.user);
  const mentorTasks = useStore((s) => s.mentorTasks);

  // Filter tasks for current student
  const myTasks = mentorTasks.filter((t) => t.assignedTo === user?.email);
  
  const activeTasks = myTasks.filter((t) => t.status === 'pending' || t.status === 'in-progress');
  const submittedTasks = myTasks.filter((t) => t.status === 'submitted');
  const gradedTasks = myTasks.filter((t) => t.status === 'graded');

  // Stats
  const avgScore = gradedTasks.length > 0 
    ? (gradedTasks.reduce((sum, t) => sum + (t.marks || 0), 0) / gradedTasks.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            Mentor Workspace
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Assigned Tasks</h2>
          <p className="text-muted-foreground">Tasks and assignments from your mentors</p>
        </div>
        <Link to="/app/workspace/grades">
          <Button variant="outline" className="gap-2 rounded-xl border-border">
            <Star className="h-4 w-4" />
            View Grades
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Tasks', value: activeTasks.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Submitted', value: submittedTasks.length, icon: Send, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Graded', value: gradedTasks.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Avg Score', value: avgScore, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Active Assignments
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Submitted — Awaiting Review */}
      {submittedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            Awaiting Review
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {submittedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Graded */}
      {gradedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Graded
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {gradedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {myTasks.length === 0 && (
        <div className="text-center py-20">
          <GraduationCap className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">No assignments yet</p>
          <p className="text-muted-foreground/60 text-sm mt-1">Your mentors haven't assigned any tasks</p>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: MentorTask }) {
  const isOverdue = isPast(new Date(task.deadline)) && task.status !== 'graded' && task.status !== 'submitted';
  const pomodoroSessions = Math.ceil(task.estimatedDuration / 25);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  return (
    <Link to={`/app/workspace/${task.id}`}>
      <Card className="bg-card border-border hover:border-indigo-500/30 transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-indigo-500/5">
        {/* Progress bar at top */}
        <div className="h-1 bg-secondary">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
            style={{ width: `${task.progress}%` }} 
          />
        </div>
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors truncate">{task.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">{task.subject}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
              {status.label}
            </span>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{task.assignedBy}</span>
            </div>
            <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400' : 'text-muted-foreground'}`}>
              {isOverdue ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              <span>{isOverdue ? 'Overdue' : formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
            </div>
            <div className={`flex items-center gap-1.5 border rounded-full px-2 py-0.5 text-xs font-semibold ${priority.bg} ${priority.color}`}>
              {task.priority}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Timer className="h-3.5 w-3.5" />
              <span>{task.estimatedDuration}min • {pomodoroSessions} Pomodoros</span>
            </div>
            {task.status === 'graded' && task.marks !== undefined && (
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                <Star className="h-3.5 w-3.5 fill-emerald-400" />
                {task.marks}/{task.maxMarks}
              </div>
            )}
            {task.progress > 0 && task.status !== 'graded' && (
              <span className="text-xs text-indigo-400 font-semibold">{task.progress}%</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
