import { Outlet, Navigate, Link, useLocation } from 'react-router';
import { useStore } from '@/store';
import { LayoutDashboard, CheckSquare, Calendar, Timer, LineChart, Target, FileText, BrainCircuit, Settings, LogOut, Bell, Menu, Sun, Moon, GraduationCap, Users, ClipboardList, Star } from 'lucide-react';
import { useState } from 'react';

type Notif = { id: string; text: string; time: string; read: boolean };
const SEED_NOTIFS: Notif[] = [
  { id: 'n1', text: '📝 New task assigned: DSA Assignment 3 — Graph Traversal', time: '2 min ago', read: false },
  { id: 'n2', text: '🔥 Your 5-day streak is alive! Keep it going.', time: '1 hour ago', read: false },
  { id: 'n3', text: '✅ Prof. Sharma graded your Calculus submission: 9/10', time: '3 hours ago', read: false },
  { id: 'n4', text: '⏰ Reminder: Quantum Physics Seminar at 2 PM today', time: '5 hours ago', read: true },
  { id: 'n5', text: '🎯 Goal milestone: Study 30 Hours is 40% complete', time: 'Yesterday', read: true },
  { id: 'n6', text: '📊 Your weekly report is ready to download', time: 'Yesterday', read: true },
];
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const studentSidebarItems = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { name: 'Tasks', path: '/app/tasks', icon: CheckSquare },
  { name: 'Timetable', path: '/app/timetable', icon: Calendar },
  { name: 'Focus', path: '/app/focus', icon: Timer },
  { name: 'Analytics', path: '/app/analytics', icon: LineChart },
  { name: 'Goals', path: '/app/goals', icon: Target },
  { name: 'Reports', path: '/app/reports', icon: FileText },
  { name: 'AI Assistant', path: '/app/ai', icon: BrainCircuit },
  { name: 'Mentor Workspace', path: '/app/workspace', icon: GraduationCap },
];

const mentorSidebarItems = [
  { name: 'Dashboard', path: '/app/mentor-dashboard', icon: LayoutDashboard },
  { name: 'Assign Tasks', path: '/app/mentor-assign', icon: ClipboardList },
  { name: 'Student Progress', path: '/app/mentor-students', icon: Users },
];

export default function AppLayout() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>(SEED_NOTIFS);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isMentor = user.role === 'mentor';
  const sidebarItems = isMentor ? mentorSidebarItems : studentSidebarItems;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border fixed h-full z-10 transition-all bg-background">
        <div className="p-6">
          <Link to={isMentor ? '/app/mentor-dashboard' : '/app'} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
              AscendOS
            </span>
          </Link>
        </div>

        {/* Role Badge */}
        <div className="px-6 mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            isMentor 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
          }`}>
            {isMentor ? <Users className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
            {isMentor ? 'Mentor' : 'Student'}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/app' && item.path !== '/app/mentor-dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors border border-transparent ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-semibold' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted font-medium'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/app/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-lg font-semibold capitalize hidden md:block">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background"></span>
                )}
              </Button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button onClick={() => { setNotifications(prev => prev.map(n => ({...n, read: true}))); }} className="text-xs text-muted-foreground hover:text-foreground">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-border">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-secondary/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? {...x, read: true} : x))}>
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                          <div className="min-w-0">
                            <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={useStore((state) => state.toggleTheme)}>
               <Sun className="h-5 w-5 hidden dark:block" />
               <Moon className="h-5 w-5 block dark:hidden" />
            </Button>

            <div className="h-8 w-px bg-border mx-1"></div>

            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-hidden cursor-pointer">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground/60 capitalize mt-1">{user.role} Account</p>
                </div>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/app/settings">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-background">
             <div className="p-6 border-b border-border flex justify-between items-center">
                <Link to={isMentor ? '/app/mentor-dashboard' : '/app'} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <BrainCircuit className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
                    AscendOS
                  </span>
                </Link>
             </div>

             {/* Mobile Role Badge */}
             <div className="px-6 pt-4">
               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                 isMentor 
                   ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                   : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
               }`}>
                 {isMentor ? <Users className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
                 {isMentor ? 'Mentor' : 'Student'}
               </div>
             </div>

             <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/app' && item.path !== '/app/mentor-dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg border border-transparent ${
                      isActive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted font-medium'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
