import { useState } from 'react';
import { useStore, Task } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus, GripVertical, CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', subject: '', priority: 'Medium', durationEstimated: 60, status: 'todo', deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  const handleCreate = () => {
    if (newTask.title && newTask.subject) {
      addTask({
        id: Date.now().toString(),
        title: newTask.title,
        subject: newTask.subject,
        priority: newTask.priority as any,
        durationEstimated: newTask.durationEstimated as number,
        durationCompleted: 0,
        deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : new Date(Date.now() + 86400000).toISOString(),
        status: 'todo'
      });
      setOpen(false);
      setNewTask({ title: '', subject: '', priority: 'Medium', durationEstimated: 60, status: 'todo', deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0] });
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'text-red-400 bg-red-500/10';
      case 'Medium': return 'text-orange-400 bg-orange-500/10';
      case 'Low': return 'text-blue-400 bg-blue-500/10';
      default: return '';
    }
  };

  const toggleStatus = (task: Task) => {
    updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your assignments and study routines.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "rounded-full shadow-lg shadow-indigo-500/20")}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Calculus HW 4" />
              </div>
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Input value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})} placeholder="Math" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v as any})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Est. Minutes</Label>
                  <Input type="number" value={newTask.durationEstimated} onChange={e => setNewTask({...newTask, durationEstimated: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Deadline</Label>
                <Input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full">Create Task</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Kanban Board like view */}
        {(['todo', 'done'] as const).map(status => (
          <div key={status} className="flex flex-col gap-3">
            <h3 className="font-semibold capitalize flex items-center gap-2 mb-2 text-foreground">
              {status === 'todo' ? 'To Do' : 'Done'}
              <span className="bg-secondary text-xs px-2 py-0.5 rounded-full text-muted-foreground font-bold">
                 {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            {tasks.filter(t => t.status === status).map(task => (
              <Card key={task.id} className={`shadow-sm hover:shadow-md transition-all duration-300 group bg-card border-border hover:-translate-y-0.5 border-l-[3px] ${task.priority === 'High' ? 'border-l-red-500' : task.priority === 'Medium' ? 'border-l-orange-500' : 'border-l-blue-500'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleStatus(task)} className="mt-1 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors">
                      {task.status === 'done' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'} truncate`}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs font-normal border-transparent bg-secondary">{task.subject}</Badge>
                        <Badge className={`text-xs font-normal border-transparent ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" /> {task.durationEstimated}m
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tasks.filter(t => t.status === status).length === 0 && (
              <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground text-sm">
                No tasks here
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
