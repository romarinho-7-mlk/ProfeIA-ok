
import { ContentType, GradeLevel, Subject } from './types';
import { BookOpen, FileCheck, ListOrdered, Presentation, Puzzle, Gamepad2, Image as ImageIcon, FileText, Grid } from 'lucide-react';

export const GRADE_LEVEL_OPTIONS = Object.values(GradeLevel);
export const SUBJECT_OPTIONS = Object.values(Subject);

// Duration chips options
export const DURATION_OPTIONS = ['30 min', '50 min', '100 min', 'Personalizado'];

export const SLIDE_COUNTS = [5, 8, 10, 12, 15];

// Generate array from 1 to 20
export const CLASS_COUNTS = Array.from({ length: 20 }, (_, i) => i + 1);

export const EXERCISE_TYPES = [
  'Múltipla Escolha',
  'Verdadeiro ou Falso',
  'Dissertativa / Aberta',
  'Preencher Lacunas',
  'Caça-Palavras',
  'Cruzadinha',
  'Relacionar Colunas',
  'Interpretação de Texto/Imagem',
  'Desenho / Criativa'
];

export const IMAGE_STYLES = [
  'Fotorealista',
  'Ilustração Digital',
  'Desenho Animado / Cartoon',
  'Aquarela',
  'Diagrama Didático',
  'Pixel Art',
  '3D Render',
  'Esboço a Lápis',
  'Pintura a Óleo'
];

export const SLIDE_THEMES = [
  { 
    id: 'giz-classico', 
    label: 'Giz Clássico', 
    description: 'Minimalista e limpo',
    previewClass: 'bg-white border border-slate-200', 
    textClass: 'text-slate-800',
    accentClass: 'bg-blue-500',
    containerClass: 'bg-white text-slate-800'
  },
  { 
    id: 'modo-escuro', 
    label: 'Modo Escuro', 
    description: 'Alto contraste elegante',
    previewClass: 'bg-slate-900 border border-slate-800', 
    textClass: 'text-white',
    accentClass: 'bg-slate-700',
    containerClass: 'bg-slate-900 text-white'
  },
  { 
    id: 'aprendizado-noturno', 
    label: 'Aprendizado Noturno', 
    description: 'Azul profundo e sério',
    previewClass: 'bg-indigo-900 border border-indigo-800', 
    textClass: 'text-white',
    accentClass: 'bg-indigo-500',
    containerClass: 'bg-indigo-900 text-white'
  },
  { 
    id: 'conhecimento-profundo', 
    label: 'Conhecimento Profundo', 
    description: 'Azul vibrante e moderno',
    previewClass: 'bg-blue-600 border border-blue-500', 
    textClass: 'text-white',
    accentClass: 'bg-blue-400',
    containerClass: 'bg-blue-600 text-white'
  },
  { 
    id: 'ceu-suave', 
    label: 'Céu Suave', 
    description: 'Tons pastéis relaxantes',
    previewClass: 'bg-blue-100 border border-blue-200', 
    textClass: 'text-slate-800',
    accentClass: 'bg-blue-300',
    containerClass: 'bg-blue-50 text-slate-800'
  },
  { 
    id: 'ideias-crescentes', 
    label: 'Ideias Crescentes', 
    description: 'Verde inspirador',
    previewClass: 'bg-teal-600 border border-teal-500', 
    textClass: 'text-white',
    accentClass: 'bg-teal-400',
    containerClass: 'bg-teal-600 text-white'
  },
  { 
    id: 'natureza-gentil', 
    label: 'Natureza Gentil', 
    description: 'Orgânico e fresco',
    previewClass: 'bg-emerald-100 border border-emerald-200', 
    textClass: 'text-emerald-900',
    accentClass: 'bg-emerald-300',
    containerClass: 'bg-emerald-50 text-emerald-900'
  },
  { 
    id: 'aprendizado-divertido', 
    label: 'Aprendizado Divertido', 
    description: 'Lúdico com formas',
    previewClass: 'bg-slate-50 border-2 border-dashed border-purple-300', 
    textClass: 'text-slate-700',
    accentClass: 'bg-purple-400',
    containerClass: 'bg-slate-50 text-slate-800 border-4 border-dashed border-purple-200'
  },
  { 
    id: 'parque-cientifico', 
    label: 'Parque Científico', 
    description: 'Clean e técnico',
    previewClass: 'bg-white border border-slate-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]', 
    textClass: 'text-slate-900',
    accentClass: 'bg-yellow-400',
    containerClass: 'bg-white text-slate-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]'
  },
];

export const ACTION_CARDS = [
  {
    type: ContentType.ACTIVITY,
    title: 'Criar Atividade',
    description: 'Exercícios e dinâmicas para fixação de conteúdo.',
    icon: Puzzle,
    color: 'text-orange-500 bg-orange-50',
    border: 'border-orange-100'
  },
  {
    type: ContentType.EXAM,
    title: 'Criar Prova',
    description: 'Avaliações completas com questões variadas.',
    icon: FileCheck,
    color: 'text-blue-500 bg-blue-50',
    border: 'border-blue-100'
  },
  {
    type: ContentType.CROSSWORD,
    title: 'Palavras Cruzadas',
    description: 'Monte cruzadinhas personalizadas com grade e dicas.',
    icon: Grid,
    color: 'text-pink-500 bg-pink-50',
    border: 'border-pink-100'
  },
  {
    type: ContentType.SEQUENCE,
    title: 'Criar Sequência',
    description: 'Planejamento passo a passo de aulas.',
    icon: ListOrdered,
    color: 'text-green-500 bg-green-50',
    border: 'border-green-100'
  },
  {
    type: ContentType.SLIDES,
    title: 'Criar Slides',
    description: 'Estrutura de apresentação para suas aulas.',
    icon: Presentation,
    color: 'text-purple-500 bg-purple-50',
    border: 'border-purple-100'
  },
  {
    type: ContentType.PDF_QUESTIONS,
    title: 'Questões sobre PDF',
    description: 'Gere perguntas a partir de qualquer arquivo PDF.',
    icon: FileText,
    color: 'text-red-500 bg-red-50',
    border: 'border-red-100'
  }
];
