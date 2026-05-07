import { useState } from 'react';
import { useStore, Doubt } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Send, CheckCircle, Clock, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function StudentDoubts() {
  const user = useStore((s) => s.user);
  const doubts = useStore((s) => s.doubts);
  const mentorTasks = useStore((s) => s.mentorTasks);
  const addDoubt = useStore((s) => s.addDoubt);

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [relatedTask, setRelatedTask] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expandedDoubt, setExpandedDoubt] = useState<string | null>(null);

  const myDoubts = doubts.filter((d) => d.studentEmail === user?.email);
  const pendingCount = myDoubts.filter((d) => d.status === 'pending').length;
  const answeredCount = myDoubts.filter((d) => d.status === 'answered').length;

  // Tasks assigned to this student for the optional dropdown
  const myTasks = mentorTasks.filter((t) => t.assignedTo === user?.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !title || !description) return;

    addDoubt({
      id: `dbt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentEmail: user?.email || '',
      studentName: user?.name || 'Student',
      mentorName: 'Prof. Sharma',
      subject,
      relatedTaskId: relatedTask || undefined,
      title,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    setSubject('');
    setRelatedTask('');
    setTitle('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
            <HelpCircle className="h-4 w-4" /> Doubt Support
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Ask Your Mentor</h2>
          <p className="text-muted-foreground">Get clarity on concepts, assignments, and topics</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
        >
          {showForm ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Ask Doubt'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
          <div className="p-3 rounded-xl border bg-blue-500/10 border-blue-500/20">
            <MessageCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-foreground">{myDoubts.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
          <div className="p-3 rounded-xl border bg-yellow-500/10 border-yellow-500/20">
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
          <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Answered</p>
            <p className="text-2xl font-bold text-foreground">{answeredCount}</p>
          </div>
        </div>
      </div>

      {/* Ask Doubt Form */}
      {showForm && (
        <Card className="bg-card border-amber-500/20 rounded-2xl animate-fade-in-up">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-400" /> Submit a Doubt
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input 
                    placeholder="e.g. DBMS, Data Structures" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required 
                    className="bg-secondary/50 border-border" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Related Task (optional)</Label>
                  <Select value={relatedTask} onValueChange={setRelatedTask}>
                    <SelectTrigger className="bg-secondary/50 border-border"><SelectValue placeholder="Select task..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {myTasks.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Doubt Title *</Label>
                <Input 
                  placeholder="e.g. Normalization confusion" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  className="bg-secondary/50 border-border" 
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea 
                  placeholder="Describe your doubt in detail..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                  className="min-h-[120px] bg-secondary/50 border-border" 
                />
              </div>
              <Button 
                type="submit" 
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 gap-2"
              >
                <Send className="h-4 w-4" /> Submit Doubt
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Doubts List */}
      <div className="space-y-4">
        {myDoubts.length > 0 ? (
          [...myDoubts].reverse().map((doubt) => {
            const isExpanded = expandedDoubt === doubt.id;
            const relatedTaskTitle = doubt.relatedTaskId 
              ? mentorTasks.find((t) => t.id === doubt.relatedTaskId)?.title 
              : null;

            return (
              <Card 
                key={doubt.id} 
                className={`bg-card border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  doubt.status === 'answered' ? 'hover:shadow-emerald-500/5' : 'hover:shadow-amber-500/5'
                }`}
                onClick={() => setExpandedDoubt(isExpanded ? null : doubt.id)}
              >
                {/* Status bar at top */}
                <div className={`h-1 ${doubt.status === 'answered' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          doubt.status === 'answered' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {doubt.status === 'answered' ? 'Answered ✅' : 'Pending'}
                        </span>
                        <span className="text-xs text-muted-foreground">{doubt.subject}</span>
                      </div>
                      <h4 className="font-semibold text-foreground">{doubt.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Asked to: {doubt.mentorName}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-fade-in-up">
                      {relatedTaskTitle && (
                        <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                          📎 Related Task: <span className="font-semibold text-foreground">{relatedTaskTitle}</span>
                        </div>
                      )}
                      <div className="bg-secondary/30 rounded-xl p-4 border border-border">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Your Question</p>
                        <p className="text-foreground text-sm leading-relaxed">{doubt.description}</p>
                      </div>
                      {doubt.status === 'answered' && doubt.response && (
                        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">Mentor Response</p>
                          <p className="text-foreground text-sm leading-relaxed">{doubt.response}</p>
                          {doubt.answeredAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Answered {formatDistanceToNow(new Date(doubt.answeredAt), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20">
            <HelpCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No doubts yet</p>
            <p className="text-muted-foreground/60 text-sm mt-1">Click "Ask Doubt" to get help from your mentor</p>
          </div>
        )}
      </div>
    </div>
  );
}
