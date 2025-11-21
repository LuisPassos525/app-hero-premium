'use client';

import { useState, useEffect } from 'react';
import { User, Globe, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [language, setLanguage] = useState('pt');
  const [notifications, setNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userStats = [
    { label: 'Dias Consecutivos', value: '7' },
    { label: 'Total de Pontos', value: '245' },
    { label: 'Nível Atual', value: '3' },
    { label: 'Conquistas', value: '12/50' }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0D0D0D]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold">Perfil</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-gray-800 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#00FF00]/10 border-4 border-[#00FF00] flex items-center justify-center text-[#00FF00] text-3xl font-bold">
              H
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold mb-1">heroi@email.com</h2>
              <p className="text-gray-400 mb-4">Membro desde Janeiro 2025</p>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="px-3 py-1 rounded-full bg-[#00FF00]/10 text-[#00FF00] text-sm font-semibold">
                  Nível 3
                </div>
                <div className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
                  245 pontos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {userStats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 text-center"
            >
              <p className="text-2xl font-bold text-[#00FF00] mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Language */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#00FF00]" />
              <h3 className="text-lg font-bold">Idioma</h3>
            </div>
            <div className="space-y-2">
              {[
                { code: 'pt', label: '🇧🇷 Português', name: 'Português' },
                { code: 'en', label: '🇺🇸 English', name: 'English' },
                { code: 'es', label: '🇪🇸 Español', name: 'Español' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    language === lang.code
                      ? 'bg-[#00FF00]/10 border-[#00FF00]'
                      : 'bg-[#0D0D0D] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#00FF00]" />
                <div>
                  <h3 className="text-lg font-bold">Notificações</h3>
                  <p className="text-sm text-gray-400">Lembretes diários de hábitos</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  notifications ? 'bg-[#00FF00]' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                    notifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy & Legal */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-gray-800 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between hover:bg-[#0D0D0D] transition-all">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#00FF00]" />
                <span>Termos de Uso</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
            <div className="border-t border-gray-800" />
            <button className="w-full p-4 flex items-center justify-between hover:bg-[#0D0D0D] transition-all">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#00FF00]" />
                <span>Política de Privacidade</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Logout */}
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-2xl p-4 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
        </div>
      </main>
    </div>
  );
}
