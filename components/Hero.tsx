
import React from 'react';
import { ACTION_CARDS } from '../constants';
import { ContentType } from '../types';

interface HeroProps {
  onActionClick: (type: ContentType) => void;
  teacherName?: string;
}

export const Hero: React.FC<HeroProps> = ({ onActionClick, teacherName }) => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-20">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-semibold mb-8 shadow-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
          Inteligência para criar, tempo para ensinar
        </div>
        
        {teacherName ? (
           <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-8 leading-tight animate-fade-in">
             Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">{teacherName}</span>!
             <br/>
             <span className="text-3xl sm:text-4xl text-slate-600 font-bold block mt-4">Vamos preparar a aula de hoje?</span>
           </h1>
        ) : (
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-8 leading-tight">
            O que vamos <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">criar juntos hoje?</span>
          </h1>
        )}

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Escolha uma ferramenta abaixo para gerar materiais didáticos completos, criativos e 100% alinhados à BNCC em poucos segundos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {ACTION_CARDS.map((card, index) => (
          <button 
            key={index} 
            onClick={() => onActionClick(card.type)}
            className={`group text-left p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-white bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}
          >
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color.replace('text-', 'from-').split(' ')[0]}/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${card.color} shadow-inner`}>
              <card.icon size={32} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{card.title}</h3>
            <p className="text-slate-500 text-base leading-relaxed">{card.description}</p>
            
            <div className="mt-6 flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
               Começar
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
