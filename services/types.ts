
export enum ContentType {
  ACTIVITY = 'Atividade',
  EXAM = 'Prova',
  SEQUENCE = 'Sequência Didática',
  SLIDES = 'Apresentação de Slides',
  INTERACTIVE = 'Atividade Interativa',
  IMAGE = 'Geração de Imagens',
  PDF_QUESTIONS = 'Questões sobre um PDF',
  CROSSWORD = 'Palavras Cruzadas',
}

export enum GradeLevel {
  EI_CRECHE = 'Educação Infantil - Creche',
  EI_PRE = 'Educação Infantil - Pré-escola',
  EFI_1 = 'Ensino Fundamental I - 1º Ano',
  EFI_2 = 'Ensino Fundamental I - 2º Ano',
  EFI_3 = 'Ensino Fundamental I - 3º Ano',
  EFI_4 = 'Ensino Fundamental I - 4º Ano',
  EFI_5 = 'Ensino Fundamental I - 5º Ano',
  EFII_6 = 'Ensino Fundamental II - 6º Ano',
  EFII_7 = 'Ensino Fundamental II - 7º Ano',
  EFII_8 = 'Ensino Fundamental II - 8º Ano',
  EFII_9 = 'Ensino Fundamental II - 9º Ano',
  EM_1 = 'Ensino Médio - 1º Ano',
  EM_2 = 'Ensino Médio - 2º Ano',
  EM_3 = 'Ensino Médio - 3º Ano',
}

export enum Subject {
  PORTUGUESE = 'Língua Portuguesa',
  MATH = 'Matemática',
  SCIENCE = 'Ciências',
  HISTORY = 'História',
  GEOGRAPHY = 'Geografia',
  ARTS = 'Artes',
  ENGLISH = 'Inglês',
  PHYSICAL_ED = 'Educação Física',
  PHYSICS = 'Física',
  CHEMISTRY = 'Química',
  BIOLOGY = 'Biologia',
  SOCIOLOGY = 'Sociologia',
  PHILOSOPHY = 'Filosofia',
}

export interface CrosswordWord {
  word: string;
  clue: string;
}

export interface GeneratorFormData {
  contentType: ContentType;
  gradeLevel: GradeLevel;
  subject: Subject;
  topic: string;
  duration: string;
  bnccFocus: string;
  additionalDetails: string;
  includeAnswerKey: boolean;
  exerciseTypes: string[];
  slideTheme?: string;
  imageStyle?: string;
  slideCount?: number;
  classCount?: number; // New field for Sequence length
  // New fields for PDF
  pdfBase64?: string;
  pdfName?: string;
  pdfQuestionCount?: number;
  pdfQuestionTypes?: string[]; // 'Discursiva' | 'Objetiva'
  pdfFocus?: string;
  // New fields for Crossword
  crosswordWords?: CrosswordWord[];
}

export interface GeneratedContent {
  rawText: string;
  timestamp: Date;
  contentType?: ContentType;
  slideTheme?: string;
}

export interface TeacherProfile {
  name: string;
  surname?: string;
  publicName?: string;
  school: string;
  city: string;
  email?: string;
  phone?: string;
  bio?: string;
  publicUrl?: string;
  isPublic?: boolean;
  avatar?: string; // Base64 string
  cover?: string; // Base64 string
}
