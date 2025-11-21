'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Calendar, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProgressData {
  day: string;
  value: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressData[]>([
    { day: 'Seg', value: 0 },
    { day: 'Ter', value: 0 },
    { day: 'Qua', value: 0 },
    { day: 'Qui', value: 0 },
    { day: 'Sex', value: 0 },
    { day: 'Sáb', value: 0 },
    { day: 'Dom', value: 0 }
  ]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = localStorage.getItem('hero_user');
    if (userData) {
      const user = JSON.parse(userData);
      
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .single();

        if (profile) {
          setUserId(profile.id);
          setTotalPoints(profile.points || 0);
          setConsecutiveDays(profile.consecutive_days || 0);
          await loadWeeklyProgress(profile.id);
        }
      } catch (error) {
        console.log('Erro ao carregar dados');
      }
    }
  };

  const loadWeeklyProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('weekly_progress')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .limit(7);

      if (data && data.length > 0) {
        const progressData = data.map(p => ({
          day: p.day,
          value: p.value
        }));
        setWeeklyProgress(progressData);
      }
    } catch (error) {
      console.log('Erro ao carregar progresso');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <header className="border-b border-gray-800 bg-[#0D0D0D]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center hover:border-[#00FF00] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Progresso Detalhado</h1>
              <p className="text-sm text-gray-400">Acompanhe sua evolução</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00]">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-400">Pontos Totais</span>
            </div>
            <p className="text-3xl font-bold">{totalPoints}</p>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00]">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-400">Dias Consecutivos</span>
            </div>
            <p className="text-3xl font-bold">{consecutiveDays}</p>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-400">Média Semanal</span>
            </div>
            <p className="text-3xl font-bold">
              {Math.round(weeklyProgress.reduce((acc, curr) => acc + curr.value, 0) / 7)}%
            </p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-6">Progresso Semanal</h2>
          
          <div className="flex items-end justify-between h-64 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-[#0D0D0D] rounded-lg overflow-hidden relative h-full">
                  <div
                    className="absolute bottom-0 w-full bg-[#00FF00] transition-all duration-500"
                    style={{ height: `${day.value}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">{day.day}</p>
                  <p className="text-sm font-semibold text-[#00FF00]">{day.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
