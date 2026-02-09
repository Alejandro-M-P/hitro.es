// src/data/lessons.ts
import { PlayCircle, Shield, Zap } from 'lucide-astro';

export const lessons = [
  {
    title: 'Defensa Base Nivel 1',
    slug: 'defensa-base-nivel-1',
    category: 'Fundamentos',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
    duration: '12:45',
    icon: Shield,
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Aprende los conceptos básicos de la defensa personal, incluyendo la postura, la guardia y los movimientos fundamentales. Este es el punto de partida para construir una base sólida.'
  },
  {
    title: 'Psicología del Combate',
    slug: 'psicologia-del-combate',
    category: 'Mentalidad',
    imageUrl: 'https://images.unsplash.com/photo-1554379658-05d0e3de00fe?q=80&w=800&auto=format&fit=crop',
    duration: '25:10',
    icon: Zap,
    youtubeId: 'dQw4w9WgXcQ',
    description: 'La defensa personal es un 90% mental. En esta lección, aprenderás a controlar el miedo, gestionar el estrés y a tomar decisiones bajo presión.'
  },
  {
    title: 'Técnicas de Suelo',
    slug: 'tecnicas-de-suelo',
    category: 'Avanzado',
    imageUrl: 'https://images.unsplash.com/photo-1543615424-e65515275a53?q=80&w=800&auto=format&fit=crop',
    duration: '45:30',
    icon: PlayCircle,
    youtubeId: 'dQw4w9WgXcQ',
    description: 'El combate a menudo termina en el suelo. Aprende a defenderte, a controlar a tu oponente y a finalizar el enfrentamiento desde una posición de desventaja.'
  },
    {
    title: 'Defensa Contra Múltiples Atacantes',
    slug: 'defensa-contra-multiples-atacantes',
    category: 'Avanzado',
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop',
    duration: '35:20',
    icon: Shield,
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Enfrentarse a más de un oponente es una de las situaciones más peligrosas. Aprende tácticas y estrategias para aumentar tus posibilidades de supervivencia.'
  },
];
