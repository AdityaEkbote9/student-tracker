import { useStore, Goal } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Trophy, Brain } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Goals() {
  const { goals, addGoal } = useStore();
  const [open, setOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: '', category: 'Academic', target: 100, progress: 0
  });

  const handleCreate = () => {
    if (newGoal.name) {
      addGoal({
        id: Date.now().toString(),
        name: newGoal.name,
        category: newGoal.category as any,
        target: newGoal.target as number,
        progress: 0,
        deadline: new Date(Date.now() + 86400000*30).toISOString()
      });
      setOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
          <h2 className="text-3xl font-bold tracking-tight">Goals & Progression</h2>
          <p className="text-muted-foreground">Track long-term achievements and academic milestones.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "rounded-full")}>
            <Plus className="mr-2 h-4 w-4" /> New Goal
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set a New Goal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               {/* Quick form for demo */}
               <div className="space-y-2">
                 <Label>Goal Name</Label>
                 <Input value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} placeholder="Master Next.js" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Category</Label>
                   <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                     value={newGoal.category} onChange={e => setNewGoal({...newGoal, category: (e.target as HTMLSelectElement).value as any})}
                   >
                     <option>Academic</option>
                     <option>Skill</option>
                     <option>Habit</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <Label>Target Value (Hours/%/etc)</Label>
                   <Input type="number" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: parseInt(e.target.value)})} />
                 </div>
               </div>
               <Button onClick={handleCreate}>Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <Card key={goal.id} className="border-border bg-card overflow-hidden group">
            <div className="h-1 bg-secondary">
               <div 
                 className="h-full rounded-r-full transition-all duration-1000 ease-out" 
                 style={{ width: `${(goal.progress / goal.target) * 100}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
               />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl border ${
                  goal.category === 'Academic' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  goal.category === 'Skill' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {goal.category === 'Academic' ? <Brain className="h-5 w-5" /> : 
                   goal.category === 'Skill' ? <Trophy className="h-5 w-5" /> : 
                   <Target className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">{goal.category}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{goal.progress} / {goal.target}</span>
                  <span className="text-muted-foreground font-mono">{Math.round((goal.progress / goal.target) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out animate-glow-pulse"
                    style={{ width: `${(goal.progress / goal.target) * 100}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
                  >
                    {/* Glowing endpoint */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white/50 blur-[2px] rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
