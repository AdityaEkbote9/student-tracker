import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore, UserRole } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, GraduationCap, Users } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  
  const login = useStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const userName = isLogin ? (role === 'mentor' ? 'Prof. Sharma' : 'Rahul') : name;
      login({ name: userName, email, role });
      
      if (role === 'mentor') {
        navigate('/app/mentor-dashboard');
      } else {
        navigate('/app');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/8 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px] animate-glow-pulse" style={{animationDelay: '1.5s'}} />
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AscendOS</span>
          </div>
        </div>

        <Card className="shadow-2xl shadow-black/20 rounded-2xl bg-card border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Enter your email to sign in to your dashboard' 
                : 'Enter your details to get started with AscendOS'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Forgot password?</a>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>{isLogin ? 'Login as' : 'Register as'}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      role === 'student'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/10'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-border hover:bg-secondary'
                    }`}
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-semibold text-sm">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('mentor')}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      role === 'mentor'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-border hover:bg-secondary'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="font-semibold text-sm">Mentor</span>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-400 font-medium hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Quick demo hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground/60">
            Demo: Use any email/password. Try both Student & Mentor roles.
          </p>
        </div>
      </div>
    </div>
  );
}
