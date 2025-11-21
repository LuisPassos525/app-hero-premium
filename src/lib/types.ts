// Types for HERO App

export interface User {
  id: string;
  email: string;
  name?: string;
  language: 'pt' | 'en' | 'es';
  createdAt: Date;
  points: number;
  level: number;
}

export interface Habit {
  id: string;
  userId: string;
  type: 'exercise' | 'smoking' | 'diet' | 'sleep' | 'custom';
  name: string;
  target: number;
  unit: string;
  completed: boolean;
  date: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface ProgressData {
  date: string;
  value: number;
  type: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  reward: number; // points
  completed: boolean;
}
