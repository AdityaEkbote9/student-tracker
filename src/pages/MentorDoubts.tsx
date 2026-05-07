import { useState } from 'react';
import { useStore, Doubt } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HelpCircle, Send, CheckCircle, Clock, MessageCircle, X, User } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function MentorDoubts() {
  const doubts = useStore((s) => s.doubts);
  const mentorTasks = useStore((s) => s.mentorTasks);
  const answerDoubt = useStore((s) => s.answerDoubt);

  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');

  const filtered = filter === 'all' ? doubts : doubts.filter((d) => d.status === filter);
  const pendingCount = doubts.filter((d) => d.status === 'pending').length;

  const handleSendResponse = (doubtId: string) => {
    if (!response.trim()) return;
    answerDoubt(doubtId, response.trim());
    setResponse('');
    setSelectedDoubt(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider">
          <HelpCircle className="h-4 w-4" /> Student Doubts
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Doubt Support</h2>
        <p className="text-muted-foreground">Review and respond to student questions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
          <div className="p-3 rounded-xl border bg-blue-500/10 border-blue-500/20">
            <MessageCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-foreground">{doubts.length}</p>
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
            <p className="text-2xl font-bold text-foreground">{doubts.filter((d) => d.status === 'answered').length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl border border-border w-fit">
        {(['all', 'pending', 'answered'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'All' : f}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full text-xs">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Doubts Table */}
      <Card className="bg-card border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Doubt</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doubt) => {
                const relatedTaskTitle = doubt.relatedTaskId
                  ? mentorTasks.find((t) => t.id === doubt.relatedTaskId)?.title
                  : null;

                return (
                  <tr key={doubt.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                          {doubt.studentName.charAt(0)}
                        </div>
                        <p className="font-semibold text-foreground text-sm">{doubt.studentName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{doubt.subject}</p>
                      {relatedTaskTitle && (
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">📎 {relatedTaskTitle}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{doubt.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        doubt.status === 'answered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {doubt.status === 'answered' ? 'Answered' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {doubt.status === 'pending' ? (
                        <Button
                          size="sm"
                          onClick={() => { setSelectedDoubt(doubt.id); setResponse(''); }}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1 rounded-lg"
                        >
                          <Send className="h-3.5 w-3.5" /> Reply
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDoubt(selectedDoubt === doubt.id ? null : doubt.id)}
                          className="text-xs gap-1"
                        >
                          View
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No doubts match this filter.</div>
        )}
      </Card>

      {/* Reply / View Modal */}
      {selectedDoubt && (() => {
        const doubt = doubts.find((d) => d.id === selectedDoubt);
        if (!doubt) return null;
        const relatedTaskTitle = doubt.relatedTaskId
          ? mentorTasks.find((t) => t.id === doubt.relatedTaskId)?.title
          : null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedDoubt(null)} />
            <Card className="relative z-10 w-full max-w-lg bg-card/95 backdrop-blur-xl border-border rounded-2xl shadow-2xl shadow-black/30">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    {doubt.status === 'pending' ? 'Reply to Doubt' : 'Doubt Details'}
                  </h3>
                  <button onClick={() => setSelectedDoubt(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Student info */}
                <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                    {doubt.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{doubt.studentName}</p>
                    <p className="text-xs text-muted-foreground">{doubt.subject}{relatedTaskTitle ? ` • ${relatedTaskTitle}` : ''}</p>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-secondary/30 rounded-xl p-4 border border-border space-y-2">
                  <p className="font-semibold text-foreground">{doubt.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doubt.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Asked {formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {/* If answered — show response */}
                {doubt.status === 'answered' && doubt.response && (
                  <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20 space-y-2">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Your Response</p>
                    <p className="text-sm text-foreground leading-relaxed">{doubt.response}</p>
                    {doubt.answeredAt && (
                      <p className="text-xs text-muted-foreground">
                        Answered {format(new Date(doubt.answeredAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                  </div>
                )}

                {/* If pending — reply form */}
                {doubt.status === 'pending' && (
                  <>
                    <div className="space-y-2">
                      <Label>Your Response</Label>
                      <Textarea
                        placeholder="Write your response to the student..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="min-h-[100px] bg-secondary/50 border-border"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleSendResponse(selectedDoubt)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 flex-1"
                      >
                        <Send className="h-4 w-4" /> Send Response
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedDoubt(null)}>Cancel</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}
