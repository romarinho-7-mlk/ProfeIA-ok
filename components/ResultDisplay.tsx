
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Copy, Check, Presentation, ChevronLeft, ChevronRight, Edit3, Save, Plus, Trash2, Bold, Italic, List, Heading1, Heading2, ImagePlus, FileUp, LayoutTemplate, Wand2, Upload, Loader2, LogOut, Printer } from 'lucide-react';
import { ContentType } from '../types';
import { SLIDE_THEMES } from '../constants';
import { exportToPPTX } from '../pptxService';
import { generateImageFromPrompt } from '../geminiService';

interface ResultDisplayProps {
  content: string;
  onBack: () => void;
  contentType?: ContentType;
  slideTheme?: string;
}

interface CrosswordData {
  width: number;
  height: number;
  words: {
    number: number;
    word: string;
    clue: string;
    x: number;
    y: number;
    direction: 'horizontal' | 'vertical';
  }[];
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onBack, contentType, slideTheme }) => {
  const [copied, setCopied] = React.useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [localSlides, setLocalSlides] = useState<string[]>([]);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editBuffer, setEditBuffer] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | 'init'>('init');

  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [cleanContent, setCleanContent] = useState(content);

  useEffect(() => {
    if (contentType === ContentType.CROSSWORD) {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]) as CrosswordData;
          setCrosswordData(parsed);
          setCleanContent(content.replace(jsonMatch[0], '').trim());
        } catch (e) {
          console.error("Failed to parse crossword JSON", e);
        }
      } else {
        setCleanContent(content);
      }
    } else {
      setCleanContent(content);
    }

    const slideSeparator = /\n\s*---\s*\n/;
    let parsedSlides = content.split(slideSeparator).map(s => s.trim()).filter(s => s.length > 0);

    if (parsedSlides.length === 0 && content.trim().length > 0) {
      parsedSlides = [content.trim()];
    }

    setLocalSlides(parsedSlides);
  }, [content, contentType]);

  useEffect(() => {
    if (!isPresentationMode || isEditingSlide) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (currentSlideIndex < localSlides.length - 1) {
          setSlideDirection('next');
          setCurrentSlideIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlideIndex > 0) {
          setSlideDirection('prev');
          setCurrentSlideIndex(prev => prev - 1);
        }
      } else if (e.key === 'Escape') {
        setIsPresentationMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, currentSlideIndex, localSlides.length, isEditingSlide]);

  const handleCopy = () => {
    const fullContent = contentType === ContentType.CROSSWORD ? cleanContent : localSlides.join('\n\n---\n\n');
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePptxExport = async () => {
    setIsExporting(true);
    try {
      const fullContent = localSlides.join('\n\n---\n\n');
      await exportToPPTX(fullContent, slideTheme, 'Aula_ProfeIA');
    } catch (error) {
      alert("Erro ao exportar PowerPoint.");
    } finally {
      setIsExporting(false);
    }
  };

  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode);
    setSlideDirection('init');
    setIsEditingSlide(false);
  };

  const nextSlide = () => {
    if (currentSlideIndex < localSlides.length - 1) {
      setSlideDirection('next');
      setCurrentSlideIndex(currentSlideIndex + 1);
      setIsEditingSlide(false);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setSlideDirection('prev');
      setCurrentSlideIndex(currentSlideIndex - 1);
      setIsEditingSlide(false);
    }
  };

  const startEditing = () => {
    setEditBuffer(localSlides[currentSlideIndex]);
    setIsEditingSlide(true);
  };

  const saveSlide = () => {
    const newSlides = [...localSlides];
    newSlides[currentSlideIndex] = editBuffer;
    setLocalSlides(newSlides);
    setIsEditingSlide(false);
  };

  const cancelEditing = () => {
    setIsEditingSlide(false);
  };

  const addNewSlide = () => {
    const newSlides = [...localSlides];
    const newSlideTemplate = "## Novo Slide\n\n- Tópico 1\n- Tópico 2";
    newSlides.splice(currentSlideIndex + 1, 0, newSlideTemplate);
    setLocalSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
    setEditBuffer(newSlideTemplate);
    setIsEditingSlide(true);
  };

  const deleteSlide = () => {
    if (localSlides.length <= 1) return;
    const newSlides = localSlides.filter((_, idx) => idx !== currentSlideIndex);
    setLocalSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
    setIsEditingSlide(false);
  };

  const handleGenerateImagesInSlide = async () => {
    if (!textareaRef.current) return;
    setIsGeneratingImage(true);
    try {
      const regex = /\[IMAGE_PROMPT:\s*([^\]]+)\]/g;
      let newText = editBuffer;
      const matches = Array.from(newText.matchAll(regex));
      for (const match of matches) {
        const promptText = match[1].trim();
        const imageUrl = await generateImageFromPrompt(promptText);
        if (imageUrl) {
          newText = newText.replace(match[0], `![${promptText}](${imageUrl})`);
        }
      }
      setEditBuffer(newText);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && textareaRef.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const text = editBuffer;
        const imageMarkdown = `\n![Imagem enviada](${base64String})\n`;
        setEditBuffer(text + imageMarkdown);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const toggleFormat = (type: 'bold' | 'italic' | 'list' | 'h1' | 'h2' | 'quote' | 'image' | 'template') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    const text = editBuffer;
    let newText = text;
    let newCursorStart = start;
    let newCursorEnd = end;

    switch (type) {
      case 'bold': newText = text.substring(0, start) + `**${text.substring(start, end)}**` + text.substring(end); newCursorEnd += 4; if (start === end) newCursorStart += 2; break;
      case 'italic': newText = text.substring(0, start) + `*${text.substring(start, end)}*` + text.substring(end); newCursorEnd += 2; if (start === end) newCursorStart += 1; break;
      case 'list': newText = text.substring(0, start) + '- ' + text.substring(end); newCursorEnd += 2; break;
      case 'h1': newText = text.substring(0, start) + '## ' + text.substring(end); newCursorEnd += 3; break;
      case 'h2': newText = text.substring(0, start) + '### ' + text.substring(end); newCursorEnd += 4; break;
      case 'image': newText = text.substring(0, start) + '[IMAGE_PROMPT: ]' + text.substring(end); newCursorEnd += 15; break;
      case 'template': const tpl = '## Título\n\n- Tópico 1\n- Tópico 2\n\n[IMAGE_PROMPT: Descrição]'; newText = text.substring(0, start) + tpl + text.substring(end); newCursorEnd += tpl.length; break;
    }
    setEditBuffer(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  const currentTheme = SLIDE_THEMES.find(t => t.label === slideTheme) || SLIDE_THEMES[0];
  const isSlideContent = contentType === ContentType.SLIDES;

  const SlideMarkdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-3xl sm:text-4xl font-black mb-6 border-b-4 border-current pb-2 inline-block" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl sm:text-3xl font-bold mb-4 mt-2" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mb-3" {...props} />,
    p: ({ node, ...props }: any) => <p className="text-lg sm:text-xl leading-relaxed mb-4 font-medium" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 space-y-2 mb-4 text-lg sm:text-xl" {...props} />,
    li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-black text-current" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-current pl-4 py-2 my-4 text-lg italic bg-black/5 rounded-r-lg" {...props} />,
    img: ({ node, ...props }: any) => (
      <div className="slide-content-image my-4 flex flex-col items-center">
        <div className="relative group rounded-lg overflow-hidden shadow-lg border-2 border-white/20 bg-white max-h-[40vh]">
          <img className="object-cover w-full h-auto" {...props} />
        </div>
      </div>
    ),
  };

  const renderCrosswordGrid = () => {
    if (!crosswordData) return null;
    const cellSize = 32;
    const grid = Array(crosswordData.height).fill(null).map(() => Array(crosswordData.width).fill(null));
    crosswordData.words.forEach(w => {
      for (let i = 0; i < w.word.length; i++) {
        const x = w.direction === 'horizontal' ? w.x + i : w.x;
        const y = w.direction === 'vertical' ? w.y + i : w.y;
        if (y < crosswordData.height && x < crosswordData.width) {
          grid[y][x] = { letter: '', number: (i === 0 ? w.number : null) };
        }
      }
    });

    return (
      <div className="my-8 flex justify-center print:block print:my-4">
        <div className="relative bg-white p-4 shadow-sm border border-slate-200 inline-block print:shadow-none print:border-none print:p-0">
          <div
            className="grid gap-[1px] bg-slate-900 border border-slate-900 print:bg-black print:border-black"
            style={{
              gridTemplateColumns: `repeat(${crosswordData.width}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${crosswordData.height}, ${cellSize}px)`
            }}
          >
            {grid.map((row, y) => (
              row.map((cell: any, x: number) => (
                <div
                  key={`${x}-${y}`}
                  className={`relative bg-white w-full h-full flex items-center justify-center ${cell ? '' : 'bg-slate-800 print:bg-black'}`}
                >
                  {cell && cell.number && <span className="absolute top-0 left-0.5 text-[8px] font-bold text-slate-800 leading-none">{cell.number}</span>}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .slide-enter-next { animation: slideInRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .slide-enter-prev { animation: slideInLeft 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        
        @media print {
            body * {
                visibility: hidden !important;
            }
            #print-root, #print-root * {
                visibility: visible !important;
            }
            #print-root {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }
            .no-print {
                display: none !important;
                height: 0 !important;
            }
            .prose {
                max-width: none !important;
                color: black !important;
            }
            .page-break {
                page-break-after: always !important;
            }
        }
      `}</style>

      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* VIEW DE IMPRESSÃO (Oculto na tela, visível apenas no PDF/Print) */}
      <div id="print-root" className="hidden print:block p-8 bg-white min-h-screen">
        {isSlideContent ? (
          <div className="space-y-12">
            <h1 className="text-2xl font-bold border-b-2 pb-2 mb-8">ProfeIA - Material de Apoio (Slides)</h1>
            {localSlides.map((slide, idx) => (
              <div key={idx} className="page-break border-2 border-slate-100 rounded-xl p-10 bg-white">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b pb-1">Slide {idx + 1}</div>
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown components={SlideMarkdownComponents}>{slide}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            {contentType === ContentType.CROSSWORD ? (
              <>
                <ReactMarkdown>{cleanContent.split('## Dicas')[0]}</ReactMarkdown>
                {renderCrosswordGrid()}
                <ReactMarkdown>{'## Dicas' + cleanContent.split('## Dicas')[1]}</ReactMarkdown>
              </>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
        )}
      </div>

      <div className={`no-print ${isSlideContent ? 'h-[calc(100vh-80px)] overflow-hidden flex flex-col bg-slate-100' : 'max-w-5xl mx-auto px-4 py-8 animate-fade-in-up'}`}>

        {/* Barra de Ações */}
        <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 ${isSlideContent ? 'rounded-none border-0 border-b shadow-sm mb-0 sticky top-0 z-30' : 'sticky top-20 z-30'}`}>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">
              <ArrowLeft size={18} className="mr-2" /> Voltar
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isSlideContent && (
              <>
                <button onClick={togglePresentationMode} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 font-bold text-sm">
                  <Presentation size={16} className="mr-2" /> Apresentar
                </button>
                <button onClick={handlePptxExport} disabled={isExporting} className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg shadow-sm hover:bg-orange-700 font-bold text-sm disabled:opacity-50">
                  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} className="mr-2" />} PowerPoint
                </button>
              </>
            )}
            <button onClick={handleCopy} className={`flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-bold transition-all ${copied ? 'bg-green-50 text-green-700' : 'bg-white text-slate-700'}`}>
              {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />} {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg shadow-lg text-sm font-bold transition-colors">
              <Printer size={16} className="mr-2" /> Salvar PDF / Imprimir
            </button>
          </div>
        </div>

        {/* Conteúdo na Tela */}
        <div className={isSlideContent ? "flex-1 flex overflow-hidden" : ""}>
          {!isSlideContent ? (
            <div className="bg-white rounded-xl shadow-xl min-h-[600px] border border-slate-100 p-10 sm:p-16 relative overflow-hidden mx-auto max-w-[210mm]">
              <div className="prose prose-slate prose-lg max-w-none">
                {contentType === ContentType.CROSSWORD ? (
                  <>
                    <ReactMarkdown>{cleanContent.split('## Dicas')[0]}</ReactMarkdown>
                    {renderCrosswordGrid()}
                    <ReactMarkdown>{'## Dicas' + cleanContent.split('## Dicas')[1]}</ReactMarkdown>
                  </>
                ) : (
                  <ReactMarkdown>{content}</ReactMarkdown>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="w-56 bg-white border-r border-slate-200 overflow-y-auto p-3 flex flex-col gap-3 flex-shrink-0">
                {localSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setCurrentSlideIndex(idx); setIsEditingSlide(false); setSlideDirection('init'); }}
                    className={`group aspect-video rounded border-2 cursor-pointer transition-all overflow-hidden bg-white ${idx === currentSlideIndex ? 'border-indigo-600 ring-2 ring-indigo-50' : 'border-slate-200'}`}
                  >
                    <div className={`w-[400%] h-[400%] origin-top-left transform scale-[0.25] p-6 overflow-hidden pointer-events-none ${currentTheme.containerClass}`}>
                      <ReactMarkdown components={SlideMarkdownComponents}>{slide}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                <button onClick={addNewSlide} className="w-full py-3 border-2 border-dashed border-slate-300 rounded hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold text-xs text-slate-400">
                  <Plus size={14} /> Novo Slide
                </button>
              </div>

              <div className="flex-1 bg-slate-100 overflow-y-auto flex flex-col items-center p-6 relative">
                <div className="w-full max-w-5xl flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    {isEditingSlide ? (
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border shadow-sm">
                        <button onClick={() => toggleFormat('bold')} className="p-1.5 hover:bg-slate-100 rounded"><Bold size={16} /></button>
                        <button onClick={() => toggleFormat('italic')} className="p-1.5 hover:bg-slate-100 rounded"><Italic size={16} /></button>
                        <button onClick={() => toggleFormat('h1')} className="p-1.5 hover:bg-slate-100 rounded"><Heading1 size={16} /></button>
                        <button onClick={() => toggleFormat('list')} className="p-1.5 hover:bg-slate-100 rounded"><List size={16} /></button>
                        <button onClick={() => toggleFormat('image')} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded"><ImagePlus size={16} /></button>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Visualização do Slide</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isEditingSlide ? (
                      <>
                        <button onClick={saveSlide} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Salvar</button>
                        <button onClick={cancelEditing} className="px-3 py-2 text-slate-500 hover:bg-slate-200 rounded-lg text-sm font-bold">Cancelar</button>
                      </>
                    ) : (
                      <button onClick={startEditing} className="px-4 py-2 bg-white border text-slate-700 rounded-lg text-sm font-bold hover:border-indigo-500 hover:text-indigo-600">Editar Conteúdo</button>
                    )}
                  </div>
                </div>

                <div className="relative w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-xl overflow-hidden">
                  {isEditingSlide ? (
                    <textarea
                      ref={textareaRef}
                      value={editBuffer}
                      onChange={(e) => setEditBuffer(e.target.value)}
                      className={`w-full h-full p-12 sm:p-16 resize-none outline-none font-mono text-lg ${currentTheme.containerClass}`}
                      autoFocus
                    />
                  ) : (
                    <div className={`absolute inset-0 flex flex-col ${currentTheme.containerClass} slide-enter-${slideDirection}`}>
                      <div className={`absolute top-0 left-0 w-full h-3 ${currentTheme.accentClass}`}></div>
                      <div className="flex-1 p-12 sm:p-16 overflow-y-auto z-10">
                        <ReactMarkdown components={SlideMarkdownComponents}>{localSlides[currentSlideIndex]}</ReactMarkdown>
                      </div>
                      <div className="h-12 px-12 flex items-center justify-between opacity-40 text-xs font-bold border-t border-current/10">
                        <span>ProfeIA</span>
                        <span>{currentSlideIndex + 1} / {localSlides.length}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modo de Apresentação */}
      {isPresentationMode && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col h-screen w-screen overflow-hidden">
          <div className="absolute top-6 left-6 z-50">
            <button onClick={togglePresentationMode} className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm shadow-xl">
              <ArrowLeft size={18} /> Voltar
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-[1700px] aspect-video relative">
              <div key={currentSlideIndex} className={`absolute inset-0 rounded-lg overflow-hidden flex flex-col ${currentTheme.containerClass} slide-enter-${slideDirection}`}>
                <div className="flex-1 p-16 sm:p-24 overflow-y-auto relative z-10">
                  <ReactMarkdown components={SlideMarkdownComponents}>{localSlides[currentSlideIndex]}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
          <div className="h-20 bg-slate-900/90 backdrop-blur border-t border-white/10 flex items-center justify-center gap-8 z-50">
            <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"><ChevronLeft size={28} /></button>
            <span className="text-white font-mono font-bold text-lg">{currentSlideIndex + 1} / {localSlides.length}</span>
            <button onClick={nextSlide} disabled={currentSlideIndex === localSlides.length - 1} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"><ChevronRight size={28} /></button>
          </div>
        </div>
      )}
    </>
  );
};
