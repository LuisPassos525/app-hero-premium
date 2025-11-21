'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    setLoading(true);
    
    try {
      // Criar perfil no Supabase
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .insert({
          email,
          name: email.split('@')[0],
          points: 0,
          level: 1,
          consecutive_days: 0
        })
        .select()
        .single();

      if (error) {
        console.log('Erro ao criar perfil:', error);
      }

      // Store user data
      localStorage.setItem('hero_user', JSON.stringify({
        id: profile?.id || '',
        email,
        language: 'pt',
        points: 0,
        level: 1
      }));
      
      router.push('/questionnaire');
    } catch (error) {
      console.log('Erro:', error);
      // Fallback para localStorage apenas
      localStorage.setItem('hero_user', JSON.stringify({
        email,
        language: 'pt',
        points: 0,
        level: 1
      }));
      router.push('/questionnaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00FF00]/10 border border-[#00FF00]/20 mb-4">
            <Sparkles className="w-8 h-8 text-[#00FF00]" />
          </div>
          <h1 className="text-4xl font-bold font-inter mb-2">HERO</h1>
          <p className="text-gray-400 text-sm">Transforme sua saúde, seja seu herói</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1A1A1A] rounded-3xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
          <p className="text-gray-400 text-sm mb-6">Comece sua jornada de transformação</p>

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00] transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-gray-800 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00] transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00] transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF00] text-black font-semibold py-3 rounded-xl hover:bg-[#00FF00]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{' '}
            <button className="text-[#00FF00] hover:underline">
              Entrar
            </button>
          </p>
        </div>

        {/* Legal Notice */}
        <p className="text-center text-xs text-gray-600 mt-6 px-4">
          Ao criar uma conta, você concorda com nossos{' '}
          <button className="text-gray-400 hover:text-gray-300 underline">
            Termos de Uso
          </button>{' '}
          e{' '}
          <button className="text-gray-400 hover:text-gray-300 underline">
            Política de Privacidade
          </button>
        </p>
      </div>
    </div>
  );
}
