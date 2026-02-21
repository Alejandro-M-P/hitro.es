// src/data/videos.ts
import { PlayCircle, Shield, Zap } from 'lucide-astro';

// initial video library content (previously stored in lessons.json)
export const videos = [
  {
    title: "Psicología del Combate",
    slug: "psicologia-del-combate",
    category: "Mentalidad",
    imageUrl: "https://images.unsplash.com/photo-1554379658-05d0e3de00fe?q=80&w=800&auto=format&fit=crop",
    duration: "25:10",
    icon: Zap,
    price: "49.99€",
    youtubeId: "dQw4w9WgXcQ",
    description: "La defensa personal es un 90% mental. En esta lección, aprenderás a controlar el miedo, gestionar el estrés y a tomar decisiones bajo presión."
  },
  {
    title: "Técnicas de Suelo",
    slug: "tecnicas-de-suelo",
    category: "Avanzado",
    imageUrl: "https://images.unsplash.com/photo-1543615424-e65515275a53?q=80&w=800&auto=format&fit=crop",
    duration: "45:30",
    icon: PlayCircle,
    price: "49.99€",
    youtubeId: "dQw4w9WgXcQ",
    description: "El combate a menudo termina en el suelo. Aprende a defenderte, a controlar a tu oponente y a finalizar el enfrentamiento desde una posición de desventaja."
  },
  {
    title: "Defensa Contra Múltiples Atacantes",
    slug: "defensa-contra-multiples-atacantes",
    category: "Avanzado",
    imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
    duration: "35:20",
    icon: Shield,
    price: "49.99€",
    youtubeId: "dQw4w9WgXcQ",
    description: "Enfrentarse a más de un oponente es una de las situaciones más peligrosas. Aprende tácticas y estrategias para aumentar tus posibilidades de supervivencia."
  }
];