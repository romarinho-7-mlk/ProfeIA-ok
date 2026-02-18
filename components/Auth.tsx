import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, UserPlus, LogIn, Loader2, BookOpen } from 'lucide-react';

interface AuthProps {
  onSession: (session: any) => void;
  onBack?: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSession, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (!supabase) {
        throw new Error('Supabase não inicializado. Verifique as configurações (VITE_SUPABASE_URL/KEY).');
      }

      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Verifique seu e-mail para confirmar o cadastro!');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (data.session) {
          onSession(data.session);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <BookOpen size={40} className="logo-icon" />
          </div>
          <h1>ProfeIA</h1>
          <p>{isSignUp ? 'Crie sua conta para começar' : 'Bem-vindo de volta'}</p>
          {onBack && (
            <button onClick={onBack} className="auth-back-btn">
              &larr; Voltar para o início
            </button>
          )}
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isSignUp ? (
              <>
                <UserPlus size={20} />
                <span>Cadastrar</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="toggle-auth"
          >
            {isSignUp
              ? 'Já tem uma conta? Entre aqui'
              : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at top left, #f8fafc, #f1f5f9);
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2563eb, #10b981);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
        }

        .logo-icon {
          color: white;
        }

        .auth-header h1 {
          color: #1e293b;
          font-size: 28px;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .auth-header p {
          color: #64748b;
          font-size: 14px;
          margin-top: 8px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          transition: color 0.3s;
        }

        .input-group input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #1e293b;
          font-size: 15px;
          transition: all 0.3s;
          outline: none;
        }

        .input-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .input-group input:focus + .input-icon {
          color: #2563eb;
        }

        .auth-button {
          margin-top: 8px;
          padding: 14px;
          background: linear-gradient(135deg, #2563eb, #10b981);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
          filter: brightness(1.05);
        }

        .auth-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-error {
          padding: 12px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: 10px;
          color: #dc2626;
          font-size: 13px;
          text-align: center;
        }

        .auth-success {
          padding: 12px;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.1);
          border-radius: 10px;
          color: #059669;
          font-size: 13px;
          text-align: center;
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
        }

        .toggle-auth {
          background: none;
          border: none;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .toggle-auth:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .auth-back-btn {
          margin-top: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .auth-back-btn:hover {
          color: #2563eb;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
