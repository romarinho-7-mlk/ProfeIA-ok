import React, { useState, useEffect, useRef } from 'react';
import { GeneratorFormData, ContentType, GradeLevel, Subject, CrosswordWord } from '../types';
import { GRADE_LEVEL_OPTIONS, SUBJECT_OPTIONS, DURATION_OPTIONS, ACTION_CARDS, EXERCISE_TYPES, SLIDE_THEMES, IMAGE_STYLES, SLIDE_COUNTS, CLASS_COUNTS } from '../constants';
import { BNCC_SKILLS } from '../bnccData';
import { getBNCCSuggestions, getCrosswordSuggestions, BNCCSuggestion } from '../geminiService';
import { Loader2, Sparkles, X, Wand2, Clock, ChevronDown, Plus, Search, Check, Book, BrainCircuit, ArrowRight, LayoutTemplate, Palette, Layers, UploadCloud, FileText, MousePointer2, CalendarDays, Grid, Trash2, Edit3 } from 'lucide-react';

interface GeneratorFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialContentType: ContentType;
  onSubmit: (data: GeneratorFormData) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  isOpen,
  onClose,
  initialContentType,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<GeneratorFormData>({
    contentType: initialContentType,
    gradeLevel: GradeLevel.EFII_6,
    subject: Subject.GEOGRAPHY,
    topic: '',
    duration: '50 min',
    bnccFocus: '',
    additionalDetails: '',
    includeAnswerKey: true,
    exerciseTypes: [],
    slideTheme: 'Giz Clássico',
    imageStyle: 'Ilustração Digital',
    slideCount: 8,
    classCount: 3,
    pdfBase64: '',
    pdfName: '',
    pdfQuestionCount: 5,
    pdfQuestionTypes: ['Objetiva'],
    pdfFocus: '',
    crosswordWords: Array(5).fill({ word: '', clue: '' })
  });

  const [customDuration, setCustomDuration] = useState(false);
  const [isSkillPickerOpen, setIsSkillPickerOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');

  // New states for manual and AI features
  const [manualSkillInput, setManualSkillInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<BNCCSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Crossword States
  const [crosswordCount, setCrosswordCount] = useState(5);
  const [crosswordTopicInput, setCrosswordTopicInput] = useState('');
  const [isFillingCrossword, setIsFillingCrossword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Derived state for selected skills array (parsed from comma string)
  const selectedSkills = formData.bnccFocus
    ? formData.bnccFocus.split(', ').filter(s => s.trim() !== '')
    : [];

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        contentType: initialContentType,
        exerciseTypes: [],
        slideTheme: 'Giz Clássico',
        imageStyle: 'Ilustração Digital',
        slideCount: 8,
        classCount: 3,
        pdfQuestionCount: 5,
        pdfQuestionTypes: ['Objetiva'],
        pdfBase64: '',
        pdfName: '',
        pdfFocus: '',
        crosswordWords: Array(5).fill({ word: '', clue: '' })
      }));
      setCrosswordCount(5);
      setCrosswordTopicInput('');
    }
  }, [isOpen, initialContentType]);

  // Reset AI suggestions when picker closes
  useEffect(() => {
    if (!isSkillPickerOpen) {
      setAiSuggestions([]);
      setManualSkillInput('');
      setSkillSearch('');
    }
  }, [isSkillPickerOpen]);

  // Handle crossword count change - resize array
  useEffect(() => {
    if (formData.contentType === ContentType.CROSSWORD) {
      setFormData(prev => {
        const current = prev.crosswordWords || [];
        let newWords = [...current];
        if (newWords.length < crosswordCount) {
          // Add
          const toAdd = crosswordCount - newWords.length;
          newWords = [...newWords, ...Array(toAdd).fill({ word: '', clue: '' })];
        } else if (newWords.length > crosswordCount) {
          // Remove
          newWords = newWords.slice(0, crosswordCount);
        }
        return { ...prev, crosswordWords: newWords };
      });
    }
  }, [crosswordCount, formData.contentType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDurationSelect = (duration: string) => {
    if (duration === 'Personalizado') {
      setCustomDuration(true);
      setFormData(prev => ({ ...prev, duration: '' }));
    } else {
      setCustomDuration(false);
      setFormData(prev => ({ ...prev, duration }));
    }
  };

  const handleSkillToggle = (code: string) => {
    let newSkills = [...selectedSkills];
    if (newSkills.includes(code)) {
      newSkills = newSkills.filter(s => s !== code);
    } else {
      newSkills.push(code);
    }
    setFormData(prev => ({ ...prev, bnccFocus: newSkills.join(', ') }));
  };

  const handleManualAddSkill = () => {
    if (manualSkillInput.trim()) {
      handleSkillToggle(manualSkillInput.trim());
      setManualSkillInput('');
    }
  };

  const handleGetSuggestions = async () => {
    if (!formData.topic) return;
    setIsSuggesting(true);
    try {
      const suggestions = await getBNCCSuggestions(formData.subject, formData.gradeLevel, formData.topic);
      setAiSuggestions(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAutoFillCrossword = async () => {
    if (!crosswordTopicInput.trim()) return;
    setIsFillingCrossword(true);
    try {
      const suggestions = await getCrosswordSuggestions(
        formData.subject,
        formData.gradeLevel,
        crosswordTopicInput,
        crosswordCount
      );

      if (suggestions.length > 0) {
        setFormData(prev => ({
          ...prev,
          topic: crosswordTopicInput, // Sync topic
          crosswordWords: suggestions
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao preencher com IA.");
    } finally {
      setIsFillingCrossword(false);
    }
  };

  const handleCrosswordWordChange = (index: number, field: keyof CrosswordWord, value: string) => {
    const newWords = [...(formData.crosswordWords || [])];
    newWords[index] = { ...newWords[index], [field]: value };
    setFormData(prev => ({ ...prev, crosswordWords: newWords }));
  };

  const removeSkill = (code: string) => {
    const newSkills = selectedSkills.filter(s => s !== code);
    setFormData(prev => ({ ...prev, bnccFocus: newSkills.join(', ') }));
  };

  const toggleExerciseType = (type: string) => {
    setFormData(prev => {
      const current = prev.exerciseTypes || [];
      if (current.includes(type)) {
        return { ...prev, exerciseTypes: current.filter(t => t !== type) };
      } else {
        return { ...prev, exerciseTypes: [...current, type] };
      }
    });
  };

  const selectSlideTheme = (themeLabel: string) => {
    setFormData(prev => ({ ...prev, slideTheme: themeLabel }));
  };

  const handleSlideCountSelect = (count: number) => {
    setFormData(prev => ({ ...prev, slideCount: count }));
  };

  // PDF Handlers
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, envie um arquivo PDF.');
        return;
      }
      processPdfFile(file);
    }
  };

  const processPdfFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      // result is "data:application/pdf;base64,....."
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, pdfBase64: base64, pdfName: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, envie um arquivo PDF.');
        return;
      }
      processPdfFile(file);
    }
  };

  const handlePdfQuestionTypeToggle = (type: string) => {
    setFormData(prev => {
      const current = prev.pdfQuestionTypes || [];
      if (current.includes(type)) {
        return { ...prev, pdfQuestionTypes: current.filter(t => t !== type) };
      } else {
        return { ...prev, pdfQuestionTypes: [...current, type] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getIconForType = (type: ContentType) => {
    const card = ACTION_CARDS.find(c => c.type === type);
    return card ? card.icon : Sparkles;
  };

  const filteredSkills = BNCC_SKILLS.filter(skill => {
    // 1. Enforce Grade Level Filter (Always)
    if (!skill.gradeLevel.includes(formData.gradeLevel)) {
      return false;
    }

    const searchLower = skillSearch.toLowerCase().trim();

    // 2. Search Logic
    if (searchLower) {
      return (
        skill.code.toLowerCase().includes(searchLower) ||
        skill.description.toLowerCase().includes(searchLower)
      );
    }

    // 3. Default View (No Search)
    return skill.subject === formData.subject;
  });

  const CurrentIcon = getIconForType(formData.contentType);

  // Logic to determine visible fields
  const isImageMode = formData.contentType === ContentType.IMAGE;
  const isSlideMode = formData.contentType === ContentType.SLIDES;
  const isPdfMode = formData.contentType === ContentType.PDF_QUESTIONS;
  const isSequenceMode = formData.contentType === ContentType.SEQUENCE;
  const isCrosswordMode = formData.contentType === ContentType.CROSSWORD;

  const showExerciseTypes = [ContentType.ACTIVITY, ContentType.EXAM, ContentType.INTERACTIVE].includes(formData.contentType);
  const showDuration = !isImageMode && !isSlideMode && !isPdfMode && !isCrosswordMode;
  const showBNCC = !isImageMode;
  const showAnswerKey = !isImageMode && !isPdfMode && showExerciseTypes;
  const showTopic = !isPdfMode && !isCrosswordMode; // Crossword has its own topic input for filling

  // Validation
  let isValid = false;
  if (isImageMode) {
    isValid = !!formData.topic.trim();
  } else if (isPdfMode) {
    isValid = !!formData.pdfBase64 && (formData.pdfQuestionTypes?.length || 0) > 0;
  } else if (isCrosswordMode) {
    const hasWords = formData.crosswordWords?.some(w => w.word.trim() && w.clue.trim());
    isValid = !!hasWords;
  } else {
    isValid = !!formData.topic.trim() && (isSlideMode ? true : !!formData.duration.trim());
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal Positioning Wrapper */}
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

            {/* Modal Panel */}
            <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-slate-100 flex flex-col max-h-[85vh]">

              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isImageMode ? 'bg-rose-50 text-rose-600' :
                      isPdfMode ? 'bg-red-50 text-red-600' :
                        isCrosswordMode ? 'bg-pink-50 text-pink-600' :
                          'bg-blue-50 text-blue-600'
                    }`}>
                    <CurrentIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 leading-none" id="modal-title">
                      {formData.contentType}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Configure os detalhes da geração</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 bg-white">
                <form id="generator-form" onSubmit={handleSubmit} className="space-y-8">

                  {/* Row 1: Subject and Grade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div className="space-y-2">
                      <label htmlFor="gradeLevel" className="block text-sm font-bold text-slate-700">Ano de escolaridade <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select
                          id="gradeLevel"
                          name="gradeLevel"
                          value={formData.gradeLevel}
                          onChange={handleChange}
                          className="appearance-none block w-full rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 py-3 px-4 cursor-pointer hover:border-slate-300 pr-10"
                        >
                          {GRADE_LEVEL_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>

                    {!isPdfMode && (
                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700">Disciplina <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="appearance-none block w-full rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 py-3 px-4 cursor-pointer hover:border-slate-300 pr-10"
                          >
                            {SUBJECT_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CROSSWORD SPECIFIC UI */}
                  {isCrosswordMode && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Count Selector */}
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Palavras e Dicas <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {[5, 10, 15, 20].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setCrosswordCount(num)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${crosswordCount === num
                                  ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300'
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                          <button
                            type="button"
                            className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 bg-white text-slate-400 cursor-not-allowed flex items-center gap-1"
                          >
                            <Edit3 size={12} /> Personalizado
                          </button>
                        </div>
                      </div>

                      {/* AI Auto-fill */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-bold text-slate-700">Preencher palavras com IA <span className="text-slate-400 font-normal">(Opcional)</span></label>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Sparkles className="h-4 w-4 text-pink-400" />
                            </div>
                            <input
                              type="text"
                              value={crosswordTopicInput}
                              onChange={(e) => setCrosswordTopicInput(e.target.value)}
                              placeholder="Digite um tema (Ex: Sistema Solar, Verbos...)"
                              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 py-3 px-4 shadow-sm"
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAutoFillCrossword())}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAutoFillCrossword}
                            disabled={isFillingCrossword || !crosswordTopicInput.trim()}
                            className="px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {isFillingCrossword ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                            Preencher
                          </button>
                        </div>
                      </div>

                      {/* Words List */}
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Palavras <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.crosswordWords?.map((item, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative group hover:border-pink-200 hover:shadow-sm transition-all">
                              <div className="absolute top-2 right-2 text-xs font-bold text-slate-300">#{index + 1}</div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Palavra"
                                  value={item.word}
                                  onChange={(e) => handleCrosswordWordChange(index, 'word', e.target.value)}
                                  className="block w-full rounded-lg border-slate-200 focus:border-pink-500 focus:ring-pink-500/20 text-sm font-bold text-slate-800 bg-white px-3 py-2"
                                />
                              </div>
                              <div>
                                <textarea
                                  rows={2}
                                  placeholder="Dica ou definição..."
                                  value={item.clue}
                                  onChange={(e) => handleCrosswordWordChange(index, 'clue', e.target.value)}
                                  className="block w-full rounded-lg border-slate-200 focus:border-pink-500 focus:ring-pink-500/20 text-sm text-slate-600 bg-white px-3 py-2 resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PDF MODE: File Upload Area */}
                  {isPdfMode && (
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">Documento <span className="text-red-500">*</span></label>
                      <div
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : formData.pdfName
                              ? 'border-green-400 bg-green-50'
                              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                          }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="application/pdf"
                          onChange={handlePdfUpload}
                        />

                        {formData.pdfName ? (
                          <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-red-500">
                              <FileText size={32} />
                            </div>
                            <p className="text-sm font-bold text-slate-800">{formData.pdfName}</p>
                            <p className="text-xs text-green-600 mt-1 font-semibold flex items-center justify-center gap-1">
                              <Check size={12} /> Arquivo carregado
                            </p>
                            <p className="text-xs text-slate-400 mt-2 hover:text-red-500 hover:underline">Clique para trocar</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400">
                              <FileText size={32} />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Arraste e solte ou selecione um arquivo</p>
                            <p className="text-xs text-slate-500 mt-1">Formatos suportados: PDF</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Standard Mode: Topic */}
                  {showTopic && (
                    <div className="space-y-2">
                      <label htmlFor="topic" className="block text-sm font-bold text-slate-700">
                        {isImageMode ? 'Descrição da Imagem' : 'Assunto / Tema'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          id="topic"
                          name="topic"
                          required
                          value={formData.topic}
                          onChange={handleChange}
                          placeholder={isImageMode ? "Ex: Um mapa detalhado do relevo brasileiro" : "Ex: Frações, Reino Animal, Guerra Fria"}
                          className="block w-full rounded-xl border border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 py-3 px-4 placeholder-slate-400 font-medium text-slate-800"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <Sparkles className="h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sequence Mode: Number of Classes */}
                  {isSequenceMode && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                          <CalendarDays size={16} />
                          Número de aulas
                          <span className="text-slate-400 font-normal">(Opcional)</span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {CLASS_COUNTS.map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, classCount: num }))}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border ${formData.classCount === num
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard Mode: Exercise Types */}
                  {showExerciseTypes && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-700">Tipos de Questões</label>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">Múltipla Escolha</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {EXERCISE_TYPES.map(type => {
                          const isSelected = formData.exerciseTypes?.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => toggleExerciseType(type)}
                              className={`flex items-center p-3 rounded-xl border text-left transition-all ${isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                              <div className={`w-4 h-4 rounded border mr-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'
                                }`}>
                                {isSelected && <Check size={10} className="text-white" />}
                              </div>
                              <span className="text-xs font-semibold">{type}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PDF MODE: Specific Fields */}
                  {isPdfMode && (
                    <>
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Número de questões <span className="text-slate-400 font-normal">(Opcional)</span></label>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, pdfQuestionCount: num }))}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border ${formData.pdfQuestionCount === num
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-slate-700">Tipo de questão <span className="text-slate-400 font-normal">(Opcional)</span></label>
                        <div className="flex gap-4">
                          {['Discursiva', 'Objetiva'].map(type => {
                            const isSelected = formData.pdfQuestionTypes?.includes(type);
                            return (
                              <label key={type} className="flex items-center cursor-pointer group">
                                <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'
                                  }`}>
                                  {isSelected && <Check size={14} className="text-white" />}
                                </div>
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={() => handlePdfQuestionTypeToggle(type)}
                                />
                                <span className="text-sm font-medium text-slate-700">{type}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pdfFocus" className="block text-sm font-bold text-slate-700">Foco da questão <span className="text-slate-400 font-normal">(Opcional)</span></label>
                        <div className="relative">
                          <input
                            type="text"
                            id="pdfFocus"
                            name="pdfFocus"
                            value={formData.pdfFocus}
                            onChange={handleChange}
                            placeholder="Qual foco você deseja para as questões? Ex: Interpretação, Gramática..."
                            className="block w-full rounded-xl border border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 py-3 px-4 placeholder-slate-400 font-medium text-slate-800 pr-10"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <MousePointer2 size={16} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Conditional Row: Slide Configuration */}
                  {isSlideMode && (
                    <div className="space-y-6">
                      {/* Slide Themes */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                            <LayoutTemplate size={16} />
                            Modelo dos Slides
                          </label>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">Visual</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {SLIDE_THEMES.map(theme => {
                            const isSelected = formData.slideTheme === theme.label;
                            return (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => selectSlideTheme(theme.label)}
                                className={`group relative flex flex-col text-left rounded-xl overflow-hidden transition-all duration-200 outline-none ${isSelected
                                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                                    : 'hover:shadow-md hover:scale-[1.02]'
                                  }`}
                              >
                                {/* Preview Area */}
                                <div className={`h-24 p-4 flex flex-col justify-center ${theme.previewClass}`}>
                                  <h4 className={`text-sm font-bold leading-tight ${theme.textClass}`}>
                                    Titulo do Slide
                                  </h4>
                                  <div className="mt-2 w-12 h-1 rounded-full opacity-40 bg-current"></div>

                                  {isSelected && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-sm">
                                      <Check size={12} strokeWidth={3} />
                                    </div>
                                  )}
                                </div>

                                {/* Label Area */}
                                <div className="bg-white p-3 border-x border-b border-slate-100 rounded-b-xl flex items-center justify-between">
                                  <span className={`text-xs font-bold text-slate-700 ${isSelected ? 'text-blue-600' : ''}`}>
                                    {theme.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Slide Count */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Layers size={16} />
                            Quantidade de Slides
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {SLIDE_COUNTS.map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => handleSlideCountSelect(count)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${formData.slideCount === count
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                              {count} slides
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conditional Row: Image Styles */}
                  {isImageMode && (
                    <div className="space-y-2">
                      <label htmlFor="imageStyle" className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Palette size={16} />
                        Estilo Visual
                      </label>
                      <div className="relative">
                        <select
                          id="imageStyle"
                          name="imageStyle"
                          value={formData.imageStyle}
                          onChange={handleChange}
                          className="appearance-none block w-full rounded-xl border border-slate-200 bg-white text-slate-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 py-3 px-4 cursor-pointer hover:border-slate-300 pr-10"
                        >
                          {IMAGE_STYLES.map(style => (
                            <option key={style} value={style}>{style}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row 3: Duration (Hidden for Image/Slides/PDF/Sequence) */}
                  {showDuration && (
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700">Duração estimada <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-3">
                        {DURATION_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleDurationSelect(opt)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${(!customDuration && formData.duration === opt) || (customDuration && opt === 'Personalizado')
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 transform scale-[1.02]'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                          >
                            {opt === 'Personalizado' && customDuration ? 'Personalizado' : opt}
                          </button>
                        ))}
                      </div>
                      {customDuration && (
                        <div className="mt-2 relative rounded-xl w-full sm:w-1/2 animate-fade-in">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-4 w-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Ex: 150 min"
                            className="block w-full pl-9 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-2.5 shadow-sm text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 4: BNCC Focus (Hidden for Image) */}
                  {showBNCC && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-bold text-slate-700">
                            Habilidades BNCC {isPdfMode && '(Opcional)'}
                          </label>
                          {!isPdfMode && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">Opcional</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Ex: EF04MA05, Interpretação de texto...</p>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                        {selectedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {selectedSkills.map(code => (
                              <span key={code} className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-white border border-blue-100 text-blue-700 shadow-sm">
                                {code.length > 40 ? code.substring(0, 40) + '...' : code}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(code)}
                                  className="ml-2 p-0.5 hover:bg-blue-50 rounded-full text-blue-400 hover:text-blue-600"
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 italic mb-3">Nenhuma habilidade selecionada.</p>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsSkillPickerOpen(true)}
                          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100 bg-white shadow-sm"
                        >
                          <Plus size={16} />
                          Selecionar Habilidades
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Row 5: Additional Details (Optional) */}
                  {!isPdfMode && (
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="additionalDetails" className="block text-sm font-bold text-slate-700">
                            {isImageMode ? 'Detalhes Adicionais da Imagem' : 'Contexto ou Instruções Extras'}
                          </label>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">Opcional</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {isImageMode
                            ? 'Cores específicas, objetos que devem aparecer, ambiente, etc.'
                            : 'Informe dificuldades da turma, metodologia preferida ou adaptações necessárias.'}
                        </p>
                      </div>
                      <textarea
                        id="additionalDetails"
                        name="additionalDetails"
                        rows={3}
                        value={formData.additionalDetails}
                        onChange={handleChange}
                        placeholder={isImageMode ? "Ex: Fundo azul claro, alta iluminação, incluir legendas..." : "Ex: A turma tem dificuldade com interpretação de texto..."}
                        className="block w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all py-3 px-4 resize-none placeholder-slate-400 text-sm"
                      />
                    </div>
                  )}

                  {/* Answer Key Toggle */}
                  {showAnswerKey && (
                    <label
                      className="flex items-center p-4 rounded-xl border border-dashed border-slate-300 cursor-pointer hover:bg-slate-50 transition-colors group"
                    >
                      <div className="relative flex items-center h-5">
                        <input
                          id="includeAnswerKey"
                          name="includeAnswerKey"
                          type="checkbox"
                          checked={formData.includeAnswerKey}
                          onChange={handleChange}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                        />
                      </div>
                      <div className="ml-3">
                        <span className="block text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                          Gerar Gabarito
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          A IA criará as respostas esperadas no final do arquivo.
                        </span>
                      </div>
                    </label>
                  )}
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !isValid}
                  className={`w-full sm:flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98] ${(isLoading || !isValid) ? 'opacity-70 cursor-not-allowed transform-none' : ''
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Gerando Material...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      {isImageMode ? 'Gerar Imagem' : `Gerar ${formData.contentType}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BNCC Skill Picker Modal */}
      {isSkillPickerOpen && (
        <div className="fixed inset-0 z-[110]" aria-labelledby="skill-picker" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSkillPickerOpen(false)}></div>
          <div className="fixed inset-0 z-[110] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 flex flex-col max-h-[85vh]">

                {/* Picker Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Adicionar habilidades BNCC</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isPdfMode ? `Foco: ${formData.pdfFocus || 'Geral'}` : `${formData.subject} • ${formData.gradeLevel}`}
                    </p>
                  </div>
                  <button onClick={() => setIsSkillPickerOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                {/* Fixed Action Area */}
                <div className="bg-white border-b border-slate-100 sticky top-0 z-20 flex-shrink-0">
                  <div className="px-6 py-3">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Buscar habilidades na lista..."
                        className="block w-full pl-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 py-3 text-sm shadow-sm transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="px-6 pb-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleGetSuggestions}
                      disabled={isSuggesting || (!formData.topic && !isPdfMode)}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${(!formData.topic && !isPdfMode)
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSuggesting
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 shadow-sm'
                        }`}
                    >
                      {isSuggesting ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <BrainCircuit className="h-4 w-4" />
                      )}
                      {isSuggesting ? 'Pensando...' : 'Sugestões IA'}
                    </button>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={manualSkillInput}
                        onChange={(e) => setManualSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualAddSkill()}
                        placeholder="Ou digite código/texto manual..."
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={handleManualAddSkill}
                        disabled={!manualSkillInput.trim()}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>{skillSearch ? 'Resultados da busca' : `Lista de ${formData.subject}`}</span>
                    {(aiSuggestions.length > 0) && (
                      <span className="text-indigo-600 font-bold flex items-center gap-1">
                        <Sparkles size={12} /> {aiSuggestions.length} sugestões encontradas
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills List */}
                <div className="flex-1 overflow-y-auto p-4 bg-white custom-scrollbar">
                  <div className="space-y-3">
                    {aiSuggestions.length > 0 && (
                      <div className="mb-6 space-y-2 animate-fade-in">
                        <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider px-1 mb-2">Sugestões da IA para "{formData.topic || formData.pdfFocus || 'tema'}"</h4>
                        {aiSuggestions.map((skill, idx) => {
                          const isSelected = selectedSkills.includes(skill.code);
                          return (
                            <div
                              key={`ai-${idx}`}
                              onClick={() => handleSkillToggle(skill.code)}
                              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md relative overflow-hidden ${isSelected
                                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                  : 'border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50'
                                }`}
                            >
                              <div className="absolute top-0 right-0 p-1.5 bg-indigo-100 rounded-bl-lg">
                                <Sparkles size={12} className="text-indigo-500" />
                              </div>

                              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-indigo-200'
                                }`}>
                                {isSelected && <Check size={12} className="text-white" />}
                              </div>
                              <div className="flex-1 pr-6">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200">
                                    {skill.code}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{skill.description}</p>
                              </div>
                            </div>
                          )
                        })}
                        <div className="h-px bg-slate-100 my-4"></div>
                      </div>
                    )}

                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill.code);
                        return (
                          <div
                            key={skill.code}
                            onClick={() => handleSkillToggle(skill.code)}
                            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${isSelected
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                : 'border-slate-100 hover:border-blue-200 bg-white'
                              }`}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'
                              }`}>
                              {isSelected && <Check size={12} className="text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                  {skill.code}
                                </span>
                                {(skillSearch || skill.subject !== formData.subject) && (
                                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                    {skill.subject}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">{skill.description}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Book className="mx-auto h-10 w-10 text-slate-200 mb-2" />
                        <h3 className="text-sm font-medium text-slate-900">Sem resultados no banco de dados</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                          Tente usar a busca manual ou a sugestão por IA.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end sticky bottom-0 z-20">
                  <button
                    type="button"
                    onClick={() => setIsSkillPickerOpen(false)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                  >
                    Salvar Seleção ({selectedSkills.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};