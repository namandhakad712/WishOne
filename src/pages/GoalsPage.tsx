import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, Clock, Plus, Trash2, AlertCircle, CheckCircle2, X, Edit2, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSupabase } from '../contexts/SupabaseContext';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../lib/supabaseClient';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { AuroraBackground } from "@/components/ui/aurora-background";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

gsap.registerPlugin(ScrollTrigger);

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', bgColor: 'bg-blue-100', textColor: 'text-blue-700', hoverBg: 'hover:bg-blue-200', gradient: 'from-blue-400 to-blue-500' },
  { value: 'medium', label: 'Medium', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', hoverBg: 'hover:bg-yellow-200', gradient: 'from-yellow-400 to-amber-500' },
  { value: 'high', label: 'High', bgColor: 'bg-red-100', textColor: 'text-red-700', hoverBg: 'hover:bg-red-200', gradient: 'from-red-400 to-red-500' }
];

const GoalsPage: React.FC = () => {
  const { user } = useSupabase();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newGoalDueDate, setNewGoalDueDate] = useState<string>('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'priority' | 'due_date' | 'created_at'>('created_at');
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const goalListRef = useRef<HTMLDivElement>(null);
  const goalFormRef = useRef<HTMLFormElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsKey, setCongratsKey] = useState(0);
  const morphTime = 0.8;
  const cooldownTime = 0.3;
  const congratsWords = ["You", "Can", "Do", "It"];

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getGoals(user.id)
      .then(data => setGoals(data || []))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    gsap.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(filtersRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" });
    gsap.fromTo(addButtonRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.5, ease: "back.out(1.7)" });
  }, []);
  useEffect(() => {
    if (goalListRef.current) {
      const goalItems = goalListRef.current.querySelectorAll('.goal-item:not(.animated)');
      if (goalItems.length > 0) {
        gsap.fromTo(
          goalItems,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", onComplete: () => { goalItems.forEach(el => el.classList.add('animated')); } }
        );
      }
    }
  }, [goals]);
  useEffect(() => {
    if (isAddingGoal && goalFormRef.current) {
      gsap.fromTo(goalFormRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
    }
  }, [isAddingGoal]);

  const filteredGoals = goals
    .filter(goal => {
      if (filter === 'active' && goal.completed) return false;
      if (filter === 'completed' && !goal.completed) return false;
      if (priorityFilter !== 'all' && goal.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityValues = { 'low': 1, 'medium': 2, 'high': 3 };
        const aValue = priorityValues[a.priority] || 0;
        const bValue = priorityValues[b.priority] || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortBy === 'due_date') {
        const aDate = a.due_date ? new Date(a.due_date).getTime() : 0;
        const bDate = b.due_date ? new Date(b.due_date).getTime() : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
    });

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newGoalTitle.trim()) return;
    const newGoal = await addGoal({
      user_id: user.id,
      title: newGoalTitle.trim(),
      priority: newGoalPriority,
      due_date: newGoalDueDate ? newGoalDueDate : null
    });
    if (newGoal) {
      setGoals([newGoal, ...goals]);
      setNewGoalTitle('');
      setNewGoalPriority('medium');
      setNewGoalDueDate('');
      setIsAddingGoal(false);
      setCongratsKey(prev => prev + 1);
      setShowCongrats(true);
    }
  };

  const handleToggleComplete = async (goalId: string, currentStatus: boolean, element: HTMLElement) => {
    const updated = await updateGoal(goalId, { completed: !currentStatus });
    setGoals(goals.map(g => g.id === goalId ? updated : g));
  };

  const handleDeleteGoal = async (goalId: string, element: HTMLElement) => {
    await deleteGoal(goalId);
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const handleStartEdit = (goal: any) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditPriority(goal.priority);
    setEditDueDate(goal.due_date ? goal.due_date.slice(0, 10) : '');
  };
  const handleCancelEdit = () => { setEditingGoal(null); };
  const handleSaveEdit = async () => {
    if (!editingGoal || !editTitle.trim()) return;
    const updated = await updateGoal(editingGoal.id, {
      title: editTitle.trim(),
      priority: editPriority,
      due_date: editDueDate ? editDueDate : null
    });
    setGoals(goals.map(g => g.id === editingGoal.id ? updated : g));
    setEditingGoal(null);
  };
  const handleSort = (field: 'priority' | 'due_date' | 'created_at') => {
    if (sortBy === field) { setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); } else { setSortBy(field); setSortDirection('desc'); }
  };
  const formatDueDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const dueDate = new Date(dateString);
    if (isToday(dueDate)) { return 'Today'; } else if (isPast(dueDate)) { return `Overdue: ${format(dueDate, 'MMM d')}`; } else { return format(dueDate, 'MMM d'); }
  };
  const getPriorityStyles = (priority: 'low' | 'medium' | 'high') => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === priority);
    return { bg: option?.bgColor || 'bg-gray-100', text: option?.textColor || 'text-gray-700', hover: option?.hoverBg || 'hover:bg-gray-200', gradient: option?.gradient || 'from-gray-400 to-gray-500' };
  };
  return (
    <AuroraBackground className="min-h-screen overflow-x-hidden">
      {showCongrats && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="backdrop-blur-xl bg-white/30 dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-700 shadow-2xl rounded-3xl px-12 py-16 min-w-[350px] min-h-[220px] flex flex-col items-center justify-center neumorphic-glass animate-fade-in-up">
            <GooeyText
              key={congratsKey}
              texts={congratsWords}
              morphTime={morphTime}
              cooldownTime={cooldownTime}
              className="font-bold"
              textClassName="text-6xl md:text-7xl text-indigo-700 dark:text-indigo-300 drop-shadow-lg"
              onComplete={() => setShowCongrats(false)}
            />
          </div>
        </div>
      )}
      {/* Absolute top-left controls row */}
      {filtersCollapsed ? (
        <div className="absolute top-2 left-2 z-50 flex flex-row items-center gap-2">
          <Link to="/" className="p-2 rounded-full hover:bg-white/50 transition-all">
            <ArrowLeft className="h-6 w-6 text-indigo-600" />
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-white/40 dark:bg-zinc-900/40 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm text-sm font-medium hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-colors m-0 mt-0 mb-0"
            style={{marginTop: 0, marginBottom: 0}}
            onClick={() => setFiltersCollapsed((prev) => !prev)}
            aria-label="Expand filters"
          >
            <Filter className="h-4 w-4" />
            Show Filters
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="absolute top-2 left-2 z-50 flex flex-row items-center gap-2">
          <Link to="/" className="p-2 rounded-full hover:bg-white/50 transition-all">
            <ArrowLeft className="h-6 w-6 text-indigo-600" />
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-white/40 dark:bg-zinc-900/40 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm text-sm font-medium hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-colors m-0 mt-0 mb-0"
            style={{marginTop: 0, marginBottom: 0}}
            onClick={() => setFiltersCollapsed((prev) => !prev)}
            aria-label="Collapse filters"
          >
            <Filter className="h-4 w-4" />
            Hide Filters
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      )}
      <div ref={filtersRef} className="backdrop-blur-md bg-white/30 dark:bg-zinc-900/30 border-b shadow-sm mt-0 pt-0 relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          {!filtersCollapsed && (
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 mt-12 pt-0 w-full">
              <div className="flex flex-wrap gap-2 px-2 py-1 bg-white/40 dark:bg-zinc-900/40 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm mb-2 sm:mb-0">
                <button className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ${filter === 'all' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setFilter('all')}>All</button>
                <button className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ${filter === 'active' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setFilter('active')}>Active</button>
                <button className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ${filter === 'completed' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setFilter('completed')}>Completed</button>
              </div>
              <div className="flex flex-wrap gap-2 px-2 py-1 bg-white/40 dark:bg-zinc-900/40 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm mb-2 sm:mb-0">
                <button className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ${priorityFilter === 'all' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setPriorityFilter('all')}>All Priority</button>
                {PRIORITY_OPTIONS.map(option => (
                  <button key={option.value} className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ${priorityFilter === option.value ? `${option.bgColor} shadow-sm` : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setPriorityFilter(option.value as 'low' | 'medium' | 'high')}>{option.label}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 px-2 py-1 bg-white/40 dark:bg-zinc-900/40 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm mb-2 sm:mb-0">
                <button className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition duration-150 ${sortBy === 'priority' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => handleSort('priority')}>Priority{sortBy === 'priority' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />)}</button>
                <button className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition duration-150 ${sortBy === 'due_date' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => handleSort('due_date')}>Due Date{sortBy === 'due_date' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />)}</button>
                <button className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition duration-150 ${sortBy === 'created_at' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => handleSort('created_at')}>Created{sortBy === 'created_at' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />)}</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`w-full max-w-3xl mx-auto p-1 sm:p-2 md:px-3 lg:p-4 pt-0 ${filtersCollapsed ? 'mt-12' : 'mt-0'}`}>
        {!isAddingGoal ? (
          <InteractiveHoverButton
            ref={addButtonRef}
            text="Add New Goal"
            className="w-full mb-4 sm:mb-6 text-base sm:text-lg mt-2 py-4"
            onClick={() => setIsAddingGoal(true)}
          />
        ) : (
          <div className="bg-white/30 dark:bg-zinc-900/30 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 p-3 sm:p-5 mb-6 transform transition-all backdrop-blur-md">
            <form ref={goalFormRef} onSubmit={handleAddGoal} className="flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="What is your goal?" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} autoFocus />
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base" value={newGoalPriority} onChange={(e) => setNewGoalPriority(e.target.value as 'low' | 'medium' | 'high')}>
                  {PRIORITY_OPTIONS.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
                <DateTimePicker value={newGoalDueDate} onChange={date => setNewGoalDueDate(date)} />
              </div>
              <div className="flex flex-row justify-end gap-2 w-full sm:w-auto">
                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base" onClick={() => setIsAddingGoal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow transition-all text-base" disabled={!newGoalTitle.trim()}>Add Goal</button>
              </div>
            </form>
          </div>
        )}
        <div ref={goalListRef} className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading goals...</div>
          ) : filteredGoals.length === 0 ? (
            <div className="bg-white/30 dark:bg-zinc-900/30 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700 p-8 text-center text-gray-500 backdrop-blur-md">
              {filter === 'all' && priorityFilter === 'all' ? (<div className="flex flex-col items-center"><div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4"><Check className="h-10 w-10 text-indigo-500" /></div><p>Master the art of not trying!</p></div>) : "No goals match your filters."}
            </div>
          ) : (
            filteredGoals.map(goal => (
              <div key={goal.id} className={`goal-item bg-white/30 dark:bg-zinc-900/30 rounded-xl shadow-md border-l-4 group hover:shadow-lg transition-all duration-200 ${goal.completed ? 'border-green-500' : goal.priority === 'high' ? 'border-red-500' : goal.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'} flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-5 backdrop-blur-md`}>
                {editingGoal?.id === goal.id ? (
                  <div className="w-full">
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base" value={editPriority} onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}>
                          {PRIORITY_OPTIONS.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                        <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex flex-row justify-end gap-2 w-full">
                      <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base" onClick={handleCancelEdit}>Cancel</button>
                      <button type="button" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow transition-all text-base" onClick={handleSaveEdit} disabled={!editTitle.trim()}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-3">
                    <button className={`flex-shrink-0 h-6 w-6 rounded-full border ${goal.completed ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 text-white shadow-sm' : 'bg-white border-gray-300 hover:border-indigo-500 hover:shadow-sm transition-all'}`} onClick={(e) => { e.stopPropagation(); handleToggleComplete(goal.id, goal.completed, e.currentTarget); }}>{goal.completed && <Check className="h-5 w-5 mx-auto" />}</button>
                    <div className="flex-grow min-w-0">
                      <div className={`text-gray-900 font-medium break-words ${goal.completed ? 'line-through text-gray-500' : ''} text-base`}>{goal.title}</div>
                      <div className="mt-1 flex flex-wrap gap-2 items-center text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getPriorityStyles(goal.priority).gradient} text-white font-medium shadow-sm`}>{PRIORITY_OPTIONS.find(opt => opt.value === goal.priority)?.label}</span>
                        {goal.due_date && (<span className={`flex items-center px-2 py-1 rounded-full ${isPast(new Date(goal.due_date)) && !goal.completed ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{isPast(new Date(goal.due_date)) && !goal.completed ? (<AlertCircle className="h-3 w-3 mr-1" />) : (<Calendar className="h-3 w-3 mr-1" />)}{formatDueDate(goal.due_date)}</span>)}
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" />Added {format(new Date(goal.created_at), 'MMM d')}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-row gap-1 opacity-70 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors" onClick={(e) => { e.stopPropagation(); handleStartEdit(goal); }}><Edit2 className="h-4 w-4" /></button>
                      <button className="p-1 text-gray-400 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id, e.currentTarget); }}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {goals.length > 0 && (
          <div className="mt-6 p-4 bg-white/30 dark:bg-zinc-900/30 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-md text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2 backdrop-blur-md">
            <div><span className="font-medium">{goals.filter(t => !t.completed).length}</span> items left</div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-green-500 flex items-center"><CheckCircle2 className="h-4 w-4 inline-block mr-1" /><span className="font-medium">{goals.filter(t => t.completed).length}</span> completed</span>
              <span className="text-red-500 flex items-center"><AlertCircle className="h-4 w-4 inline-block mr-1" /><span className="font-medium">{goals.filter(t => !t.completed && t.due_date && isPast(new Date(t.due_date))).length}</span> overdue</span>
            </div>
          </div>
        )}
      </div>
    </AuroraBackground>
  );
};

export default GoalsPage; 