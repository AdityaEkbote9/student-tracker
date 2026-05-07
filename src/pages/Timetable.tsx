import { useStore, TimetableEvent } from '@/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, Timer, Minus, Sparkles } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const MOCK_EVENTS: TimetableEvent[] = [
  {
    id: 'm1',
    title: 'Adv. Calculus Lecture',
    start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).setHours(9, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).setHours(9, 0, 0, 0)).toISOString() : new Date().toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).setHours(11, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).setHours(11, 0, 0, 0)).toISOString() : new Date().toISOString(),
    backgroundColor: '#dbeafe', // blue-100
    textColor: '#1e3a8a', // blue-900
  },
  {
    id: 'm2',
    title: 'Neurobiology Deep Work',
    start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 2)).setHours(11, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 2)).setHours(11, 0, 0, 0)).toISOString() : new Date().toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 2)).setHours(13, 30, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 2)).setHours(13, 30, 0, 0)).toISOString() : new Date().toISOString(),
    backgroundColor: '#d1fae5', // emerald-100
    textColor: '#064e3b', // emerald-900
    subtext: 'Optimal Focus Window',
    isOptimal: true,
  },
  {
    id: 'm3',
    title: 'Macroeconomics Review',
    start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(8, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(8, 0, 0, 0)).toISOString() : new Date().toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(9, 30, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(9, 30, 0, 0)).toISOString() : new Date().toISOString(),
    backgroundColor: '#ffedd5', // orange-100
    textColor: '#7c2d12', // orange-900
  },
  {
    id: 'm4',
    title: 'Quantum Physics Seminar',
    start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(14, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(14, 0, 0, 0)).toISOString() : new Date().toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(17, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).setHours(17, 0, 0, 0)).toISOString() : new Date().toISOString(),
    backgroundColor: '#f3e8ff', // purple-100
    textColor: '#581c87', // purple-900
    avatars: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2']
  },
  {
    id: 'm5',
    title: 'Quantum Physics Practice Problems',
    start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).setHours(16, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).setHours(16, 0, 0, 0)).toISOString() : new Date().toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).setHours(18, 0, 0, 0) ? new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).setHours(18, 0, 0, 0)).toISOString() : new Date().toISOString(),
    backgroundColor: '#d1fae5', // emerald-100
    textColor: '#064e3b', // emerald-900
    isOptimal: true,
  }
];

export default function Timetable() {
  const { events, addEvent, updateEvent, deleteEvent } = useStore();
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimetableEvent>>({
    title: '', start: new Date().toISOString().slice(0, 16), end: new Date(Date.now() + 3600000).toISOString().slice(0, 16), backgroundColor: '#6366f1'
  });

  const MODULE_COLORS = ['#3b82f6', '#8b5cf6', '#9ca3af', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
  const [modules, setModules] = useState([
    { id: '1', name: 'Adv. Calculus', color: '#3b82f6' },
    { id: '2', name: 'Quantum Physics', color: '#8b5cf6' },
    { id: '3', name: 'Macroeconomics', color: '#9ca3af' },
    { id: '4', name: 'Neurobiology', color: '#22c55e' },
  ]);
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');

  const handleAddModule = () => {
    if (!newModuleName.trim()) return;
    const usedColors = modules.map(m => m.color);
    const nextColor = MODULE_COLORS.find(c => !usedColors.includes(c)) || MODULE_COLORS[modules.length % MODULE_COLORS.length];
    setModules([...modules, { id: Date.now().toString(), name: newModuleName.trim(), color: nextColor }]);
    setNewModuleName('');
    setAddingModule(false);
  };

  const handleDeleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
  };

  useEffect(() => {
    // Seed mock events into store on first load
    if (events.length <= 1) {
      MOCK_EVENTS.forEach((e) => addEvent(e));
    }
  }, []);

  const handleCreate = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      addEvent({
        id: Math.random().toString(36).substring(7),
        title: newEvent.title,
        start: new Date(newEvent.start).toISOString(),
        end: new Date(newEvent.end).toISOString(),
        backgroundColor: newEvent.backgroundColor || '#6366f1'
      });
      setOpen(false);
      setNewEvent({ title: '', start: new Date().toISOString().slice(0, 16), end: new Date(Date.now() + 3600000).toISOString().slice(0, 16), backgroundColor: '#6366f1' });
    }
  };

  const handleEventClick = (info: any) => {
    if (confirm(`Delete '${info.event.title}'?`)) {
      deleteEvent(info.event.id);
    }
  };

  const handleEventDrop = (info: any) => {
    updateEvent(info.event.id, {
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : undefined,
    });
  };

  const renderEventContent = (eventInfo: any) => {
    const isOptimal = eventInfo.event.extendedProps.isOptimal;
    const textColor = eventInfo.event.textColor || eventInfo.event.extendedProps.textColor;
    
    return (
      <div className={cn("flex flex-col h-full overflow-hidden p-1.5 rounded-md w-full border relative", 
        isOptimal ? "border-emerald-300 dark:border-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.3)] bg-gradient-to-br from-white/40 to-transparent dark:from-black/10" : "border-transparent",
        textColor ? "" : "text-white")} 
        style={{ color: textColor }}>
        <div className="flex justify-between items-start text-[10px] font-bold opacity-80 mb-0.5 whitespace-normal leading-[1.2]">
            <span>{eventInfo.timeText}</span>
            {isOptimal && <Sparkles className="w-3.5 h-3.5 ml-1 shrink-0 text-emerald-600 dark:text-emerald-400" />}
        </div>
        <div className="font-extrabold text-xs leading-tight whitespace-normal tracking-tight">
          {eventInfo.event.title}
        </div>
        {eventInfo.event.extendedProps.subtext && (
          <div className={cn("text-[10px] mt-1 opacity-90 leading-tight font-semibold whitespace-normal", isOptimal ? "text-emerald-700 dark:text-emerald-300" : "")}>
            {eventInfo.event.extendedProps.subtext}
          </div>
        )}
        {eventInfo.event.extendedProps.avatars && (
             <div className="flex -space-x-1.5 mt-auto pt-2">
                 {eventInfo.event.extendedProps.avatars.map((url: string, i: number) => (
                    <img key={i} src={url} className="w-5 h-5 rounded-full ring-2 ring-purple-100 dark:ring-background object-cover" />
                 ))}
             </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Weekly Protocol</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Midterm Preparation Phase</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-indigo-500/20 gap-2">
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Calculus Lecture" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start</Label>
                  <Input type="datetime-local" value={newEvent.start} onChange={e => setNewEvent({...newEvent, start: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>End</Label>
                  <Input type="datetime-local" value={newEvent.end} onChange={e => setNewEvent({...newEvent, end: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'].map(c => (
                    <button key={c} onClick={() => setNewEvent({...newEvent, backgroundColor: c})} className={`w-8 h-8 rounded-full border-2 transition-all ${newEvent.backgroundColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{backgroundColor: c}} />
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={handleCreate} className="w-full">Create Event</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        <div className="space-y-6">
          {/* Countdown Card */}
          <Card className="bg-purple-50/80 dark:bg-purple-900/10 border-none shadow-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-50"></div>
            <Timer className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="text-xl font-bold">Quantum Physics</h3>
            <p className="text-purple-600 dark:text-purple-400 text-sm font-semibold mb-6">Midterm Exam</p>
            
            <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center">
                    <div className="text-4xl font-extrabold tracking-tighter">12</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Days</div>
                </div>
                <div className="text-3xl font-light text-muted-foreground mb-4">:</div>
                <div className="flex flex-col items-center">
                    <div className="text-4xl font-extrabold tracking-tighter">14</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Hrs</div>
                </div>
            </div>
          </Card>

          {/* Subject Modules */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Subject Modules</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><GripVertical className="h-4 w-4" /></Button>
            </div>
            
            <div className="space-y-2">
              {modules.map((mod) => (
                <div key={mod.id} className="flex items-center justify-between p-3.5 bg-card border rounded-xl shadow-sm cursor-pointer hover:border-primary/50 transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mod.color, boxShadow: `0 0 8px ${mod.color}80` }}></div>
                      <span className="font-semibold text-sm">{mod.name}</span>
                   </div>
                   <button onClick={() => handleDeleteModule(mod.id)} className="text-muted-foreground/50 hover:text-red-400 transition-colors">
                     <Minus className="h-4 w-4" />
                   </button>
                </div>
              ))}
              
              {addingModule ? (
                <div className="flex items-center gap-2 p-2">
                  <Input
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                    placeholder="Module name..."
                    className="h-9 text-sm"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleAddModule} className="h-9 px-3">Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setAddingModule(false); setNewModuleName(''); }} className="h-9 px-2">✕</Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full border-dashed rounded-xl py-6 text-muted-foreground font-semibold hover:bg-muted/50 transition-colors" onClick={() => setAddingModule(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Module
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-4 overflow-hidden">
          <div className="min-h-[700px] fc-custom-wrapper">
            {/* @ts-ignore - Types mismatch with React 19 */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={false} // Hidden to match image style heavily
              events={events}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              eventResize={handleEventDrop} 
              eventContent={renderEventContent}
              height="auto"
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              allDaySlot={false}
              nowIndicator={true}
              dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
              slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: false, hour12: false }}
              expandRows={true}
            />
          </div>
        </div>
      </div>
      
      {/* FullCalendar CSS Overrides to match theme */}
      <style>{`
        .fc {
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: hsl(var(--muted));
          --fc-neutral-text-color: hsl(var(--muted-foreground));
          --fc-border-color: hsl(var(--border) / 0.5);
          --fc-button-text-color: hsl(var(--primary-foreground));
          --fc-button-bg-color: hsl(var(--primary));
          --fc-button-border-color: hsl(var(--primary));
          --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
          --fc-button-hover-border-color: hsl(var(--primary) / 0.9);
          --fc-button-active-bg-color: hsl(var(--primary) / 0.8);
          --fc-button-active-border-color: hsl(var(--primary) / 0.8);
          --fc-event-bg-color: hsl(var(--primary));
          --fc-event-border-color: transparent;
          --fc-event-text-color: white;
          --fc-today-bg-color: transparent;
          --fc-now-indicator-color: #3b82f6;
        }
        
        /* Custom calendar styling to match AscendOS design */
        .fc-theme-standard .fc-scrollgrid {
          border: none;
        }

        .fc-theme-standard td, .fc-theme-standard th {
          border: none;
        }

        .fc .fc-timegrid-col-events {
            margin: 0 4px;
        }
        
        .fc-theme-standard .fc-scrollgrid-sync-inner {
            padding: 10px 0 20px 0;
            border-bottom: 2px solid hsl(var(--border) / 0.5);
            margin-bottom: 10px;
        }
        
        .fc-col-header-cell-cushion {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-transform: capitalize;
          font-weight: 700;
          color: hsl(var(--muted-foreground));
          font-size: 0.85rem;
          letter-spacing: -0.01em;
        }
        
        .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion {
          color: hsl(var(--primary));
          background: hsl(var(--primary) / 0.1);
          padding: 8px 16px;
          border-radius: 12px;
          margin-top: -8px;
        }

        .fc .fc-timegrid-slot-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground) / 0.7);
          padding-right: 16px;
          border: none;
          vertical-align: top;
        }

        .fc-timegrid-axis-cushion {
          display: none; /* Hide the timezone/empty top-left cell */
        }

        .fc .fc-timegrid-slot {
          border-bottom: 1px solid hsl(var(--border) / 0.3);
          height: 60px; /* Taller slots for breathing room */
        }
        
        .fc .fc-timegrid-col.fc-day-today {
           background: transparent;
        }

        /* Differentiate weekend columns visually */
        .fc-day-sat, .fc-day-sun {
           background-color: hsl(var(--muted) / 0.2);
           border-radius: var(--radius);
        }

        .fc .fc-event {
          border-radius: 8px;
          border: none;
          box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.05);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .fc .fc-event:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.1);
        }

        .fc-timegrid-event-harness {
           margin-bottom: 2px;
        }
        
        .fc-timegrid-divider {
            display: none;
        }
        
      `}</style>
    </div>
  );
}
