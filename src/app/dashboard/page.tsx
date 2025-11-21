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
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('Herói');
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('hero_user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.email.split('@')[0]);
      setPoints(user.points || 0);
      setLevel(user.level || 1);
    }
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Dias Consecutivos',
      value: '7',
      change: '+2 esta semana',
      icon: <Flame className="w-6 h-6" />,
      trend: 'up'
    },
    {
      title: 'Metas Concluídas',
      value: '12/15',
      change: '80% completo',
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
      value: '85%',
      change: '+5% este mês',
      icon: <Heart className="w-6 h-6" />,
      trend: 'up'
    }
  ];

  const todayHabits = [
    { id: 1, name: 'Exercício Físico', completed: true, points: 10 },
    { id: 2, name: 'Hidratação (2L água)', completed: true, points: 5 },
    { id: 3, name: 'Sem cigarro', completed: false, points: 15 },
    { id: 4, name: 'Meditação 10min', completed: false, points: 8 }
  ];

  const weeklyProgress = [
    { day: 'Seg', value: 85 },
    { day: 'Ter', value: 92 },
    { day: 'Qua', value: 78 },
    { day: 'Qui', value: 95 },
    { day: 'Sex', value: 88 },
    { day: 'Sáb', value: 70 },
    { day: 'Dom', value: 90 }
  ];

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
            <Link 
              href="/profile"
              className="w-10 h-10 rounded-full bg-[#00FF00]/10 border-2 border-[#00FF00] flex items-center justify-center text-[#00FF00] font-bold hover:bg-[#00FF00]/20 transition-all"
            >
              {userName.charAt(0).toUpperCase()}
            </Link>
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
                <button className="text-sm text-[#00FF00] hover:underline flex items-center gap-1">
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {todayHabits.map((habit) => (
                  <div
                    key={habit.id}
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
                            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={habit.completed ? 'line-through text-gray-500' : ''}>
                          {habit.name}
                        </span>
                      </div>
                      <span className="text-sm text-[#00FF00] font-semibold">
                        +{habit.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-[#00FF00] hover:text-[#00FF00] transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar Hábito
              </button>
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
                <Link
                  href="/challenges"
                  className="block p-3 rounded-xl bg-[#0D0D0D] border border-gray-800 hover:border-[#00FF00] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Desafios Semanais</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </Link>
                <Link
                  href="/achievements"
                  className="block p-3 rounded-xl bg-[#0D0D0D] border border-gray-800 hover:border-[#00FF00] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conquistas</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </Link>
                <Link
                  href="/progress"
                  className="block p-3 rounded-xl bg-[#0D0D0D] border border-gray-800 hover:border-[#00FF00] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ver Progresso</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
