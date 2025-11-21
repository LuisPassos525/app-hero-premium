'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, Target, Award } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#00FF00]/10 border-2 border-[#00FF00]/20 mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-[#00FF00]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-inter mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            HERO
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-2">
            Transforme sua saúde, seja seu herói
          </p>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Plataforma premium para melhorar seus hábitos de saúde sexual e vascular através de gamificação e acompanhamento inteligente
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 hover:border-[#00FF00]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00] mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Acompanhamento</h3>
            <p className="text-sm text-gray-400">
              Monitore seu progresso com gráficos e estatísticas detalhadas
            </p>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 hover:border-[#00FF00]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00] mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Desafios</h3>
            <p className="text-sm text-gray-400">
              Complete desafios semanais e alcance suas metas de saúde
            </p>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 hover:border-[#00FF00]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#00FF00]/10 flex items-center justify-center text-[#00FF00] mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Gamificação</h3>
            <p className="text-sm text-gray-400">
              Ganhe pontos, conquistas e suba de nível na sua jornada
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto px-8 py-4 bg-[#00FF00] text-black font-bold rounded-xl hover:bg-[#00FF00]/90 transition-all duration-300 shadow-lg shadow-[#00FF00]/20"
          >
            Começar Agora
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-[#1A1A1A] text-white font-semibold rounded-xl border-2 border-gray-800 hover:border-[#00FF00] transition-all duration-300"
          >
            Ver Demo
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-gray-600">
          <p>Sua jornada de transformação começa aqui 🚀</p>
        </div>
      </div>
    </div>
  );
}
