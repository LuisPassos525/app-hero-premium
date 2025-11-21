'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Award, 
  Calendar,
  Activity,
  Heart,
  Zap,
  ChevronRight,
  Check,
  ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface Habit {
  name: string;
  description: string;
  completed: boolean;
}

interface WeeklyProgressData {
  day: string;
  value: number;
}

// Hábitos fixos para saúde sexual
const FIXED_HABITS: Omit<Habit, 'completed'>[] = [
  { name: 'Sem comida processada', description: 'Evitar alimentos processados' },
  { name: 'Sem masturbação', description: 'Controle e disciplina' },
  { name: 'Treinou', description: '40 - 60 minutos' },
  { name: 'Banho de sol', description: 'Min 15 minutos' },
  { name: 'Sem álcool', description: 'Evitar bebidas alcoólicas' }
];

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Herói');
  const [userId, setUserId] = useState<string>('');
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(5);
  const [mounted, setMounted] = useState(false);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressData[]>([
    { day: 'Seg', value: 0 },
    { day: 'Ter', value: 0 },
    { day: 'Qua', value: 0 },
    { day: 'Qui', value: 0 },
    { day: 'Sex', value: 0 },
    { day: 'Sáb', value: 0 },
    { day: 'Dom', value: 0 }
  ]);

  useEffect(() => {
    setMounted(true);
    loadUserData();
    generateWeekDays();
  }, []);

  useEffect(() => {
    if (userId) {
      loadHabitsForDate(selectedDate);
    }
  }, [selectedDate, userId]);

  const generateWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, etc
    const monday = new Date(today);
    
    // Ajustar para segunda-feira da semana atual
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + diff);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    
    setWeekDays(days);
  };

  const loadUserData = async () => {
    const userData = localStorage.getItem('hero_user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.email.split('@')[0]);
      
      // Carregar dados do Supabase
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .single();

        if (profile) {
          setPoints(profile.points || 0);
          setLevel(profile.level || 1);
          setConsecutiveDays(profile.consecutive_days || 0);
          setUserId(profile.id);
          
          // Carregar progresso semanal
          await loadWeeklyProgress(profile.id);
          
          // Calcular metas concluídas
          await calculateGoalsCompleted(profile.id);
        } else {
          // Criar perfil se não existir
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({ email: user.email })
            .select()
            .single();
          
          if (newProfile) {
            setUserId(newProfile.id);
          }
        }
      } catch (error) {
        console.log('Erro ao carregar dados do usuário');
      }
    }
  };

  const loadHabitsForDate = async (date: Date) => {
    if (!userId) return;

    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', dateStr);

      // Criar array de hábitos com status de completado
      const habitsWithStatus = FIXED_HABITS.map(fixedHabit => {
        const completion = data?.find(d => d.habit_name === fixedHabit.name);
        return {
          ...fixedHabit,
          completed: completion?.completed || false
        };
      });

      setTodayHabits(habitsWithStatus);
    } catch (error) {
      console.log('Erro ao carregar hábitos');
      // Inicializar com hábitos não completados
      setTodayHabits(FIXED_HABITS.map(h => ({ ...h, completed: false })));
    }
  };

  const calculateGoalsCompleted = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('completed', true);

      setGoalsCompleted(data?.length || 0);
    } catch (error) {
      console.log('Erro ao calcular metas');
    }
  };

  const loadWeeklyProgress = async (userId: string) => {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      
      const progressData = await Promise.all(
        ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(async (day, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index);
          const dateStr = date.toISOString().split('T')[0];
          
          const { data } = await supabase
            .from('habit_completions')
            .select('*')
            .eq('user_id', userId)
            .eq('date', dateStr)
            .eq('completed', true);
          
          const completedCount = data?.length || 0;
          const percentage = (completedCount / FIXED_HABITS.length) * 100;
          
          return { day, value: percentage };
        })
      );
      
      setWeeklyProgress(progressData);
    } catch (error) {
      console.log('Erro ao carregar progresso semanal');
    }
  };

  const toggleHabit = async (habitName: string) => {
    if (!userId) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const habit = todayHabits.find(h => h.name === habitName);
    if (!habit) return;

    const newCompleted = !habit.completed;
    
    // Atualizar estado local
    setTodayHabits(prev => 
      prev.map(h => 
        h.name === habitName ? { ...h, completed: newCompleted } : h
      )
    );

    // Atualizar pontos (apenas para o dia atual)
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    if (isToday) {
      const pointsChange = newCompleted ? 10 : -10;
      const newPoints = Math.max(0, points + pointsChange);
      setPoints(newPoints);
      
      // Atualizar pontos no banco
      await supabase
        .from('user_profiles')
        .update({ points: newPoints })
        .eq('id', userId);
      
      // Recalcular metas concluídas
      await calculateGoalsCompleted(userId);
    }

    // Atualizar no Supabase
    try {
      const { data: existing } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_name', habitName)
        .eq('date', dateStr)
        .single();

      if (existing) {
        // Atualizar existente
        await supabase
          .from('habit_completions')
          .update({ completed: newCompleted })
          .eq('id', existing.id);
      } else {
        // Criar novo
        await supabase
          .from('habit_completions')
          .insert({
            user_id: userId,
            habit_name: habitName,
            completed: newCompleted,
            date: dateStr
          });
      }
      
      // Recarregar progresso semanal
      await loadWeeklyProgress(userId);
    } catch (error) {
      console.log('Erro ao atualizar hábito');
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDays = weekDays.map(day => {
      const newDay = new Date(day);
      newDay.setDate(day.getDate() + (direction === 'next' ? 7 : -7));
      return newDay;
    });
    setWeekDays(newDays);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };

  const stats: StatCard[] = [
    {
      title: 'Dias Consecutivos',
      value: consecutiveDays.toString(),
      change: consecutiveDays > 0 ? `+${Math.min(2, consecutiveDays)} esta semana` : 'Comece hoje!',
      icon: <Flame className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Metas Concluídas',
      value: `${goalsCompleted}/${totalGoals}`,
      change: totalGoals > 0 ? `${Math.round((goalsCompleted / totalGoals) * 100)}% completo` : 'Adicione metas',
      icon: <Target className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Pontos Totais',
      value: points.toString(),
      change: 'Nível ' + level,
      icon: <Award className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Saúde Geral',
      value: totalGoals > 0 ? `${Math.round((goalsCompleted / totalGoals) * 100)}%` : '0%',
      change: goalsCompleted > 0 ? `+${goalsCompleted} hoje` : 'Comece agora',
      icon: <Heart className="w-6 h-6" />,
      trend: 'up'
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-inter">HERO</h1>
              <p className="text-sm text-gray-400">Bem-vindo, {userName}</p>
            </div>
            <button 
              onClick={() => router.push('/profile')}
              className="w-10 h-10 rounded-full bg-[#00FF00]/10 border-2 border-[#00FF00] flex items-center justify-center text-[#00FF00] font-bold hover:bg-[#00FF00]/20 transition-all"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00]">
                  {stat.icon}
                </div>
                <span className="text-xs text-[#00FF00] font-semibold">
                  {stat.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
              <h3 className="text-sm text-gray-400 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Habits */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#00FF00]" />
                  Hábitos de Hoje
                </h2>
                <button 
                  onClick={() => router.push('/habits')}
                  className="text-sm text-[#00FF00] hover:underline flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Week Navigation */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 rounded-lg hover:bg-[#0D0D0D] transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="flex-1 flex justify-center gap-2">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                          isSameDay(day, selectedDate)
                            ? 'bg-[#00FF00] text-black'
                            : isToday(day)
                            ? 'bg-[#00FF00]/10 text-[#00FF00] border-2 border-[#00FF00]/30'
                            : 'bg-[#0D0D0D] text-gray-400 hover:bg-[#0D0D0D]/50'
                        }`}
                      >
                        <span className="text-xs font-semibold mb-1">
                          {formatDayName(day)}
                        </span>
                        <span className="text-lg font-bold">
                          {formatDayNumber(day)}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 rounded-lg hover:bg-[#0D0D0D] transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Habits List */}
              <div className="space-y-3">
                {todayHabits.map((habit, index) => (
                  <div
                    key={index}
                    onClick={() => toggleHabit(habit.name)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      habit.completed
                        ? 'bg-[#00FF00]/5 border-[#00FF00]/30'
                        : 'bg-[#0D0D0D] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            habit.completed
                              ? 'bg-[#00FF00] border-[#00FF00]'
                              : 'border-gray-600'
                          }`}
                        >
                          {habit.completed && (
                            <Check className="w-4 h-4 text-black" strokeWidth={3} />
                          )}
                        </div>
                        <div>
                          <span className={`block ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                            {habit.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {habit.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-[#00FF00] font-semibold">
                        +10 pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00FF00]" />
                Progresso Semanal
              </h2>

              <div className="flex items-end justify-between h-40 gap-2">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0D0D0D] rounded-lg overflow-hidden relative h-full">
                      <div
                        className="absolute bottom-0 w-full bg-[#00FF00] transition-all duration-500"
                        style={{ height: `${day.value}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00FF00]" />
                Ações Rápidas
              </h2>

              <div className="space-y-2">
                <button
                  onClick={() => router.push('/habits')}
                  className="w-full p-3 rounded-xl bg-[#0D0D0D] border border-gray-800 hover:border-[#00FF00] transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gerenciar Hábitos</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                <button
                  onClick={() => router.push('/progress')}
                  className="w-full p-3 rounded-xl bg-[#0D0D0D] border border-gray-800 hover:border-[#00FF00] transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ver Progresso Detalhado</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full p-3 rounded-xl bg-[#0D0D0D] border border-gray-800 hover:border-[#00FF00] transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Configurações</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
