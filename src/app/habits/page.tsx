'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  points: number;
}

export default function HabitsPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitPoints, setNewHabitPoints] = useState(10);
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
          await loadHabits(profile.id);
        }
      } catch (error) {
        console.log('Erro ao carregar dados');
      }
    }
  };

  const loadHabits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (data) {
        setHabits(data.map(h => ({
          id: h.id,
          name: h.name,
          completed: h.completed,
          points: h.points
        })));
      }
    } catch (error) {
      console.log('Erro ao carregar hábitos');
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completed: false,
      points: newHabitPoints
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setNewHabitPoints(10);
    setShowAddHabit(false);

    try {
      if (userId) {
        await supabase
          .from('habits')
          .insert({
            user_id: userId,
            name: newHabitName,
            points: newHabitPoints,
            completed: false
          });
      }
    } catch (error) {
      console.log('Erro ao adicionar hábito');
    }
  };

  const deleteHabit = async (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));

    try {
      await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);
    } catch (error) {
      console.log('Erro ao deletar hábito');
    }
  };

  const toggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newCompleted = !habit.completed;
    
    setHabits(prev => 
      prev.map(h => 
        h.id === habitId ? { ...h, completed: newCompleted } : h
      )
    );

    try {
      await supabase
        .from('habits')
        .update({ 
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null
        })
        .eq('id', habitId);
    } catch (error) {
      console.log('Erro ao atualizar hábito');
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
              <h1 className="text-2xl font-bold">Gerenciar Hábitos</h1>
              <p className="text-sm text-gray-400">Adicione e gerencie seus hábitos diários</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
          <div className="space-y-3 mb-6">
            {habits.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">Nenhum hábito adicionado ainda</p>
                <p className="text-sm">Clique em "Adicionar Hábito" para começar!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    habit.completed
                      ? 'bg-[#00FF00]/5 border-[#00FF00]/30'
                      : 'bg-[#0D0D0D] border-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          habit.completed
                            ? 'bg-[#00FF00] border-[#00FF00]'
                            : 'border-gray-600 hover:border-[#00FF00]'
                        }`}
                      >
                        {habit.completed && (
                          <Check className="w-4 h-4 text-black" strokeWidth={3} />
                        )}
                      </button>
                      <span className={habit.completed ? 'line-through text-gray-500' : ''}>
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#00FF00] font-semibold">
                        +{habit.points} pts
                      </span>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {showAddHabit ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                placeholder="Nome do hábito..."
                className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border-2 border-gray-700 focus:border-[#00FF00] outline-none transition-all"
                autoFocus
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-400">Pontos:</label>
                <input
                  type="number"
                  value={newHabitPoints}
                  onChange={(e) => setNewHabitPoints(parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  className="w-24 px-4 py-2 rounded-xl bg-[#0D0D0D] border-2 border-gray-700 focus:border-[#00FF00] outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addHabit}
                  className="flex-1 py-3 rounded-xl bg-[#00FF00] text-black font-semibold hover:bg-[#00FF00]/90 transition-all"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowAddHabit(false);
                    setNewHabitName('');
                    setNewHabitPoints(10);
                  }}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-700 text-gray-400 hover:border-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAddHabit(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-[#00FF00] hover:text-[#00FF00] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Hábito
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
