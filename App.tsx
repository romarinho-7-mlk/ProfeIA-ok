
import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Settings } from 'lucide-react';
import { Hero } from './components/Hero';
import { GeneratorForm } from './components/GeneratorForm';
import { ResultDisplay } from './components/ResultDisplay';
import { SettingsModal } from './components/SettingsModal';
import { generateEducationalContent } from './geminiService';
import { GeneratorFormData, ContentType, TeacherProfile } from './types';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { LogOut } from 'lucide-react';


const App: React.FC = () => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(ContentType.ACTIVITY);
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);


  // Teacher Profile State with LocalStorage Persistence
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({
    name: '',
    school: '',
    city: ''
  });

  useEffect(() => {
    // Check if Supabase is properly configured
    if (!supabase) {
      setError('Configuração do Supabase não encontrada. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      setIsAuthLoading(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    }).catch(err => {
      console.error("Session check failed", err);
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const savedProfile = localStorage.getItem('teacherProfile');
    if (savedProfile) {
      try {
        setTeacherProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSaveProfile = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    localStorage.setItem('teacherProfile', JSON.stringify(profile));
  };

  // Store full form data to pass theme to result display
  const [lastFormData, setLastFormData] = useState<GeneratorFormData | null>(null);

  const handleActionClick = (type: ContentType) => {
    setSelectedContentType(type);
    setIsModalOpen(true);
  };

  const handleGenerate = async (formData: GeneratorFormData) => {
    setIsModalOpen(false);
    setIsLoading(true);
    setError(null);
    setLastFormData(formData);

    try {
      const result = await generateEducationalContent(formData, teacherProfile);
      setGeneratedContent(result);
    } catch (err: any) {
      console.error(err);
      setError(`Erro: ${err.message || "Ocorreu um erro ao gerar o conteúdo."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setGeneratedContent(null);
    setError(null);
  };

  // Determine the display name for the Hero greeting
  // Prioritize publicName, then name
  const greetingName = teacherProfile.publicName || teacherProfile.name;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    if (showAuth) {
      return (
        <Auth
          onSession={(s) => setSession(s)}
          onBack={() => setShowAuth(false)}
        />
      );
    }
    return (
      <LandingPage
        onStart={() => setShowAuth(true)}
        onLogin={() => setShowAuth(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 flex flex-col relative">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl opacity-70 mix-blend-multiply filter animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-100/60 rounded-full blur-3xl opacity-70 mix-blend-multiply filter animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl opacity-70 mix-blend-multiply filter animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 transition-all duration-200 backdrop-blur-md bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
              <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                Profe<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">IA</span>
              </span>
            </div>
            <nav className="flex items-center space-x-4 sm:space-x-6">
              <a
                href="https://basenacionalcomum.mec.gov.br/abase/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors hidden sm:block"
              >
                Habilidades BNCC
              </a>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50"
              >
                {teacherProfile.avatar ? (
                  <img src={teacherProfile.avatar} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <Settings size={16} />
                )}
                <span className="hidden sm:inline">Perfil</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-50"
                title="Sair"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-20 flex-grow flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-800">Criando seu material...</h3>
            <p className="text-slate-500 mt-2">A IA está consultando a BNCC e estruturando o conteúdo.</p>
            {teacherProfile.name && (
              <p className="text-indigo-500 text-sm mt-2 font-medium bg-indigo-50 px-3 py-1 rounded-full">Personalizando para: {teacherProfile.name}</p>
            )}
          </div>
        ) : generatedContent ? (
          <ResultDisplay
            content={generatedContent}
            onBack={handleBack}
            contentType={lastFormData?.contentType}
            slideTheme={lastFormData?.slideTheme}
          />
        ) : (
          <>
            <Hero onActionClick={handleActionClick} teacherName={greetingName} />

            {/* Modal Form */}
            <GeneratorForm
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              initialContentType={selectedContentType}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />

            {/* Settings Page (Full Screen Modal) */}
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              currentProfile={teacherProfile}
              onSave={handleSaveProfile}
            />

            {/* Error Notification */}
            {error && (
              <div className="max-w-2xl mx-auto px-4 mt-6 animate-fade-in">
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Erro na geração</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {!isLoading && !generatedContent && (
        <footer className="relative z-10 bg-white border-t border-slate-100 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <p className="text-slate-500 text-sm font-medium">
                &copy; {new Date().getFullYear()} ProfeIA
              </p>
            </div>
            <p className="text-slate-400 text-sm text-center sm:text-right">
              Ferramenta de auxílio ao professor. Sempre revise o conteúdo gerado pela IA.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
