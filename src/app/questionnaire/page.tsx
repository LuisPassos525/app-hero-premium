'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'Qual é seu principal objetivo?',
    options: [
      'Melhorar saúde sexual',
      'Parar de fumar',
      'Aumentar exercícios físicos',
      'Melhorar alimentação',
      'Todos os acima'
    ]
  },
  {
    id: 2,
    question: 'Com que frequência você pratica exercícios?',
    options: [
      'Diariamente',
      '3-5 vezes por semana',
      '1-2 vezes por semana',
      'Raramente',
      'Nunca'
    ]
  },
  {
    id: 3,
    question: 'Você fuma atualmente?',
    options: [
      'Sim, diariamente',
      'Sim, ocasionalmente',
      'Parei recentemente',
      'Nunca fumei'
    ]
  },
  {
    id: 4,
    question: 'Como você avalia sua qualidade de sono?',
    options: [
      'Excelente (7-9h por noite)',
      'Boa (6-7h por noite)',
      'Regular (5-6h por noite)',
      'Ruim (menos de 5h)'
    ]
  },
  {
    id: 5,
    question: 'Qual idioma você prefere?',
    options: [
      '🇧🇷 Português',
      '🇺🇸 English',
      '🇪🇸 Español'
    ]
  }
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: answer });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save answers and redirect to dashboard
      localStorage.setItem('hero_questionnaire', JSON.stringify(answers));
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Pergunta {currentStep + 1} de {questions.length}
            </span>
            <span className="text-sm text-[#00FF00] font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00FF00] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 font-inter">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === option;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#00FF00]/10 border-[#00FF00] text-white'
                      : 'bg-[#0D0D0D] border-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#00FF00] flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D0D0D] border border-gray-800 text-gray-300 hover:border-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#00FF00] text-black font-semibold hover:bg-[#00FF00]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Pular questionário
          </button>
        </div>
      </div>
    </div>
  );
}
