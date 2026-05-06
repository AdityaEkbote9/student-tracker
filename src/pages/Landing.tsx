import React from 'react';
import { Link } from 'react-router';
import { useStore } from '@/store';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrainCircuit, CheckSquare, Timer, Target, ArrowRight, Sun, Moon } from 'lucide-react';

export default function Landing() {
  const toggleTheme = useStore((state) => state.toggleTheme);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AscendOS</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">Testimonials</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground mr-2" onClick={toggleTheme}>
             <Sun className="h-5 w-5 hidden dark:block" />
             <Moon className="h-5 w-5 block dark:hidden" />
          </Button>
          <Link to="/login" className="text-sm font-medium hover:text-foreground text-muted-foreground">Login</Link>
          <Link to="/login" className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 shadow-xl shadow-indigo-500/20")}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Split Layout from Design Recipe */}
        <section className="pt-24 pb-32 px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              AscendOS 2.0 is live
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-foreground scroll-m-20">
              Master your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">academic life</span> with AI.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              The ultimate Student Operating System. Reduce procrastination, organize study schedules, build unbreakable habits, and gain visibility into your productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full h-14 px-8 text-base shadow-xl shadow-indigo-600/20")}>
                Start Ascending <ArrowRight className="ml-2 h-5 w-5"/>
              </Link>
              <Link to="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full h-14 px-8 text-base shadow-none")}>
                View Demo
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2670&auto=format&fit=crop" alt="Dashboard Preview" className="w-full h-auto opacity-70" />
              <div className="absolute top-4 left-4 right-4 bg-background/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                     <Timer className="h-5 w-5 text-emerald-400" />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-foreground">Focus Session</p>
                     <p className="text-xs text-muted-foreground">2h 15m remaining</p>
                   </div>
                 </div>
                 <Badge>Deep Work</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-card border-t border-border mt-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-foreground">Everything you need to succeed</h2>
              <p className="text-muted-foreground">Forget using 5 different apps. We combined task management, pomodoro timers, AI scheduling, and gamification into one unified workspace.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BrainCircuit, title: 'AI Study Assistant', desc: 'Input your syllabus and exam date, and get a realistic AI-generated study roadmap instantly.' },
                { icon: CheckSquare, title: 'Task & Goal Tracking', desc: 'Break down assignments into subtasks, set academic goals, and visualize your progress over time.' },
                { icon: Timer, title: 'Pomodoro Engine', desc: 'Built-in focus timers with strict deep work modes and gamified XP rewards to keep you motivated.' },
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-3xl bg-secondary/50 border border-border hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-background text-center">
        <p className="text-muted-foreground font-medium">© 2026 AscendOS. Master your potential.</p>
      </footer>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-400/20">{children}</span>
}
