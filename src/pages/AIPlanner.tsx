import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, Sparkles, Calendar, BookOpen } from 'lucide-react';

export default function AIPlanner() {
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState('');
  const [examDate, setExamDate] = useState('');
  const [hours, setHours] = useState('3');
  const [difficulty, setDifficulty] = useState('Medium');
  
  const [plan, setPlan] = useState<any>(null);

  const generatePlan = async () => {
    if (!syllabus || !examDate) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabus, examDate, availableHours: hours, subjectDifficulty: difficulty })
      });
      
      const data = await res.json();
      if (data.roadmap) {
        setPlan(data);
      } else if (data.error && data.error.includes("API key not valid")) {
        alert("Your Gemini API key is missing or invalid. Please check your AI Studio settings.");
      } else {
        alert(data.error || "Failed to generate plan");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Study Planner</h2>
        <p className="text-muted-foreground">Generate a personalized roadmap tailored to your exams.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="bg-indigo-500/10 rounded-t-xl border-b border-border">
              <CardTitle className="flex items-center gap-2 text-indigo-400">
                <BrainCircuit className="h-5 w-5" /> Let AI chart your path
              </CardTitle>
              <CardDescription>Input your constraints and let the engine optimize your time.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label>Syllabus / Topics</Label>
                <Textarea 
                  placeholder="e.g., Intro to Networking, OSI Model, TCP/IP, Subnetting..."
                  className="resize-none h-24"
                  value={syllabus}
                  onChange={e => setSyllabus(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Date</Label>
                  <Input 
                    type="date" 
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hours per day</Label>
                  <Input 
                     type="number" 
                     min="1" max="15" 
                     value={hours}
                     onChange={e => setHours(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subject Difficulty</Label>
                <div className="flex gap-2">
                  {['Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        difficulty === diff 
                          ? 'border-primary bg-primary/20 text-primary-foreground' 
                          : 'border-border bg-transparent text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full h-12 text-base rounded-xl shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300" 
                onClick={generatePlan}
                disabled={loading || !syllabus || !examDate}
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-5 w-5" /> Generate Roadmap</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
           {!plan ? (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl bg-secondary/50">
               <div className="w-16 h-16 bg-secondary border border-border rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
                 <BrainCircuit className="h-8 w-8" />
               </div>
               <h3 className="text-lg font-semibold text-foreground mb-2">Awaiting Parameters</h3>
               <p className="text-sm text-muted-foreground max-w-md">The AI study assistant uses Gemini 3.1 Pro to analyze your constraints and output an optimal daily roadmap.</p>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="text-emerald-500" /> Your Academic Roadmap
                  </h3>
                  <Button variant="outline" size="sm">Add to Tasks</Button>
                </div>
                
                <div className="space-y-4">
                  {plan.roadmap?.map((item: any, idx: number) => (
                    <Card key={idx} className="border-l-4 border-l-primary bg-card border-y-border border-r-border">
                      <CardContent className="p-5 flex gap-4">
                        <div className="flex-shrink-0 w-16 text-center">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Day</p>
                          <p className="text-2xl font-black text-foreground">{item.day?.replace('Day ', '') || idx+1}</p>
                        </div>
                        <div className="w-px bg-border"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-semibold text-lg text-foreground">{item.topic}</h4>
                             <Badge variant="secondary"><Clock className="w-3 h-3 mr-1"/>{item.duration}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.suggestion}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {plan.advice && plan.advice.length > 0 && (
                  <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardContent className="p-5">
                      <h4 className="font-semibold text-amber-500 mb-2">Expert Advice</h4>
                      <ul className="space-y-1.5 list-disc list-inside text-sm text-amber-400">
                         {plan.advice.map((adv: string, i: number) => <li key={i}>{adv}</li>)}
                      </ul>
                    </CardContent>
                  </Card>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
// Add missing badge/clock from local to fix error
import { Clock } from 'lucide-react';
function Badge({ children, variant='default', className='' }: any) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variant==='secondary' ? 'bg-secondary text-muted-foreground border border-border' : 'bg-primary text-primary-foreground border border-primary'} ${className}`}>{children}</span>
}
