import React from 'react';
import {
  BookOpen,
  Sparkles,
  Layout,
  FileText,
  Presentation,
  Grid,
  Layers,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const [isPaying, setIsPaying] = React.useState<string | null>(null);

  const handlePayment = async (planName: string, planPrice: string) => {
    try {
      setIsPaying(planName);
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName, planPrice }),
      });

      const data = await response.json();
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        alert('Erro ao iniciar pagamento: ' + (data.error || 'Tente novamente.'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao tentar assinar.');
    } finally {
      setIsPaying(null);
    }
  };

  return (
    <div className="landing-container">
      {/* Header/Nav */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <div className="logo-icon-bg">
              <BookOpen size={24} className="logo-icon" />
            </div>
            <span>Profe<span className="accent">IA</span></span>
          </div>
          <div className="nav-links">
            <button onClick={onLogin} className="btn-text">Entrar</button>
            <button onClick={onStart} className="btn-primary-small">Começar Agora</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-badge">Plataforma #1 para Professores com IA</div>
        <h1 className="hero-title">
          Transforme suas aulas com <span className="highlight">tecnologia</span>
        </h1>
        <p className="hero-subtitle">
          Crie atividades, provas, slides e sequências didáticas personalizadas em segundos.
          Tudo alinhado à BNCC, para que você foque no que importa: ensinar.
        </p>
        <div className="hero-actions">
          <button onClick={onStart} className="btn-primary">
            Começar Gratuitamente <ArrowRight size={20} />
          </button>
          <button className="btn-secondary">Ver Funcionalidades</button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Tudo que você precisa</h2>
          <p>Ferramentas profissionais para elevar seu trabalho em sala de aula.</p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon={<Sparkles size={24} />}
            title="Gerador de Atividades"
            description="Exercícios criativos e dinâmicos para qualquer disciplina e série."
          />
          <FeatureCard
            icon={<FileText size={24} />}
            title="Provas Inteligentes"
            description="Avaliações completas com questões variadas e gabarito automático."
          />
          <FeatureCard
            icon={<Presentation size={24} />}
            title="Slides em Sugundos"
            description="Estrutura de apresentação pronta para suas aulas explicativas."
          />
          <FeatureCard
            icon={<Grid size={24} />}
            title="Cruzadinhas Smart"
            description="Monte passatempos educativos personalizados com grade e dicas."
          />
          <FeatureCard
            icon={<Layers size={24} />}
            title="Planejamento BNCC"
            description="Sequências didáticas detalhadas alinhadas às diretrizes nacionais."
          />
          <FeatureCard
            icon={<ShieldCheck size={24} />}
            title="Segurança Total"
            description="Dados protegidos com criptografia e isolamento por professor."
          />
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans">
        <div className="section-header">
          <h2>Planos</h2>
          <p>Escolha o plano ideal para o seu momento.</p>
        </div>

        <div className="plans-grid">
          <PlanCard
            name="Free"
            price="0"
            features={['Até 5 gerações/mês', 'Atividades básicas', 'IA de texto padrão']}
            buttonText="Começar Grátis"
            onAction={onStart}
          />
          <PlanCard
            name="Pro"
            price="29"
            isPopular
            isLoading={isPaying === 'Pro'}
            features={['Gerações ilimitadas', 'Acesso ao Groq (Ultra rápido)', 'Gerador de Slides', 'Exportação para PDF']}
            buttonText="Assinar"
            onAction={() => handlePayment('Pro', '29')}
          />
          <PlanCard
            name="Elite"
            price="89"
            isLoading={isPaying === 'Elite'}
            features={['Tudo do Pro', 'Marca do Professor', 'Suporte Prioritário', 'Análise de PDFs ilimitada']}
            buttonText="Assinar"
            onAction={() => handlePayment('Elite', '89')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-small">
              <BookOpen size={18} />
              <span>ProfeIA</span>
            </div>
            <p>Sempre revise o conteúdo gerado pela IA.</p>
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} ProfeIA - Inteligência Pedagógica
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .landing-container {
          background-color: #ffffff !important;
          color: #0f172a !important;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
        }

        /* Nav */
        .landing-nav {
          padding: 24px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.5px;
          color: #0f172a;
        }

        .logo-icon-bg {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          padding: 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
        }

        .accent {
          color: #2563eb;
        }

        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .btn-text {
          background: none;
          border: none;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s;
        }

        .btn-text:hover { color: #0f172a; }

        .btn-primary-small {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary-small:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        /* Hero */
        .hero {
          max-width: 1000px;
          margin: 0 auto;
          padding: 120px 24px 100px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 1);
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .hero-title {
          font-size: clamp(40px, 8vw, 84px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 32px;
          color: #0f172a;
        }

        .highlight {
          color: transparent;
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          position: relative;
        }

        .hero-subtitle {
          font-size: clamp(16px, 2vw, 20px);
          color: #475569;
          max-width: 700px;
          line-height: 1.6;
          margin-bottom: 48px;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          border: none;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(37, 99, 235, 0.4);
          filter: brightness(1.1);
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          padding: 18px 36px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        /* Sections General */
        section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 24px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-header h2 {
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -1px;
          color: #0f172a;
        }

        .section-header p {
          color: #475569;
          font-size: 18px;
        }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 40px;
          border-radius: 24px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .feature-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .feature-icon {
          color: #3b82f6;
          margin-bottom: 24px;
        }

        .feature-card h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1e293b;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
          font-size: 15px;
        }

        /* Plans */
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .plan-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 48px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .plan-card.popular {
          border-color: #2563eb;
          background: #ffffff;
          transform: scale(1.05);
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.15);
        }

        .popular-badge {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          align-self: flex-start;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 24px;
          text-transform: uppercase;
        }

        .plan-name {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
          color: #0f172a;
        }

        .plan-price {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 32px;
          color: #0f172a;
        }

        .plan-price span {
          font-size: 16px;
          color: #64748b;
          font-weight: 600;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 48px;
          flex-grow: 1;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #475569;
          margin-bottom: 16px;
          font-size: 15px;
        }

        .plan-features li .check-icon {
          color: #3b82f6;
        }

        .plan-btn {
          padding: 16px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          border: none;
          width: 100%;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #0f172a;
        }

        .btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .plan-card.popular .plan-btn {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
        }

        /* Footer */
        .landing-footer {
          border-top: 1px solid #e2e8f0;
          padding: 60px 0;
          background: #f8fafc;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
        }

        .logo-small {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          margin-bottom: 8px;
          color: #0f172a;
        }

        .footer-brand p {
          color: #64748b;
          font-size: 13px;
        }

        .footer-copy {
          color: #475569;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .nav-content { flex-direction: column; gap: 20px; }
          .hero-title { font-size: 48px; }
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-actions button { width: 100%; justify-content: center; }
          .plans-grid { grid-template-columns: 1fr; }
          .plan-card.popular { transform: none; }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const PlanCard = ({ name, price, features, isPopular, buttonText, onAction, isLoading }: any) => (
  <div className={`plan-card ${isPopular ? 'popular' : ''}`}>
    {isPopular && <div className="popular-badge">Mais Popular</div>}
    <h3 className="plan-name">{name}</h3>
    <div className="plan-price">R$ {price}<span>/mês</span></div>
    <ul className="plan-features">
      {features.map((f: string, i: number) => (
        <li key={i}>
          <Zap size={14} className="check-icon" />
          {f}
        </li>
      ))}
    </ul>
    <button
      onClick={onAction}
      disabled={isLoading}
      className={`plan-btn ${isPopular ? '' : 'btn-outline'}`}
      style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
    >
      {isLoading ? 'Processando...' : buttonText}
    </button>
  </div>
);
