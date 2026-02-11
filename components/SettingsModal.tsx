
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Upload, Trash2, Save, User, MapPin, Mail, Phone, Globe, School, FileText } from 'lucide-react';
import { TeacherProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: TeacherProfile;
  onSave: (profile: TeacherProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onSave 
}) => {
  const [profile, setProfile] = useState<TeacherProfile>(currentProfile);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setProfile(currentProfile);
    }
  }, [isOpen, currentProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
     setProfile(prev => ({ ...prev, isPublic: e.target.checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto animate-fade-in">
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
         <button 
           onClick={onClose}
           className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
         >
           <ArrowLeft size={20} />
           Voltar
         </button>
         <div className="text-sm font-bold text-slate-400">Configurações de Perfil</div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
        <form onSubmit={handleSubmit}>
          
          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-10 items-start">
             
             {/* Avatar */}
             <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">Foto de perfil</label>
                <div className="relative group w-40 h-40 mx-auto md:mx-0">
                  <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center ${!profile.avatar ? 'text-slate-300' : ''}`}>
                     {profile.avatar ? (
                       <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <span className="text-5xl font-bold">{profile.name.charAt(0) || 'U'}</span>
                     )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                </div>
             </div>

             {/* Cover */}
             <div className="space-y-2 w-full">
                <label className="block text-sm font-bold text-slate-900">Foto de capa</label>
                <div className="relative group w-full h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                   {profile.cover ? (
                     <img src={profile.cover} alt="Capa" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        <Upload size={24} className="mb-2 opacity-50"/>
                        <span className="text-xs font-medium">Adicionar banner</span>
                     </div>
                   )}
                   <button 
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-slate-700 p-2 rounded-lg shadow-sm hover:text-blue-600 text-xs font-bold flex items-center gap-2"
                  >
                    <Camera size={14} />
                    {profile.cover ? 'Alterar Capa' : 'Adicionar Capa'}
                  </button>
                  <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                </div>
             </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-10"></div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
             
             {/* Name */}
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-800">Nome</label>
               <input
                 type="text"
                 name="name"
                 value={profile.name}
                 onChange={handleChange}
                 placeholder="Seu primeiro nome"
                 className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
               />
             </div>

             {/* Surname */}
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-800">Sobrenome</label>
               <input
                 type="text"
                 name="surname"
                 value={profile.surname || ''}
                 onChange={handleChange}
                 placeholder="Digite seu sobrenome"
                 className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
               />
             </div>

             {/* Public Name */}
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-800">Nome público</label>
               <input
                 type="text"
                 name="publicName"
                 value={profile.publicName || ''}
                 onChange={handleChange}
                 placeholder="Como alunos te veem (Ex: Prof. Romario)"
                 className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
               />
             </div>

             {/* Public URL */}
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-800">URL pública</label>
               <input
                 type="text"
                 name="publicUrl"
                 value={profile.publicUrl || ''}
                 onChange={handleChange}
                 placeholder="Digite sua url pública"
                 className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
               />
             </div>
          </div>

          {/* Toggle Public Profile */}
          <div className="my-8 flex items-center gap-3">
             <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isPublic"
                  id="isPublic"
                  checked={!!profile.isPublic}
                  onChange={handleToggle}
                  className="peer sr-only"
                />
                <label 
                  htmlFor="isPublic"
                  className="block h-6 overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer peer-checked:bg-blue-500 transition-colors"
                ></label>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
             </div>
             <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
               Perfil público 
               <span className="text-slate-400 font-normal text-xs">(Outros professores poderão ver seus materiais)</span>
             </span>
          </div>

          {/* Bio */}
          <div className="space-y-2 mb-8">
             <label className="text-sm font-bold text-slate-800">Bio</label>
             <textarea
               name="bio"
               rows={4}
               value={profile.bio || ''}
               onChange={handleChange}
               placeholder="Conte um pouco sobre você para outros professores..."
               className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
             />
             <div className="text-right text-xs text-slate-400">Até 350 caracteres</div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-8"></div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-800">Telefone</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="https://flagcdn.com/w20/br.png" alt="Brasil" className="w-5 h-auto rounded-sm opacity-80" />
                    <span className="text-slate-300 ml-2">|</span>
                 </div>
                 <input
                   type="tel"
                   name="phone"
                   value={profile.phone || ''}
                   onChange={handleChange}
                   placeholder="+55 11 99999-9999"
                   className="w-full pl-14 p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-bold text-slate-800">E-mail</label>
               <input
                 type="email"
                 name="email"
                 value={profile.email || ''}
                 onChange={handleChange}
                 placeholder="seu@email.com"
                 className="w-full p-3 rounded-xl border border-slate-200 bg-gray-50 text-slate-500 cursor-not-allowed" // Simulated read-only style based on screenshot context often being primary email
               />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800">Escola</label>
                <div className="relative">
                   <School className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                   <input
                     type="text"
                     name="school"
                     value={profile.school}
                     onChange={handleChange}
                     placeholder="Nome da sua escola"
                     className="w-full pl-10 p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800">Cidade</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                   <input
                     type="text"
                     name="city"
                     value={profile.city}
                     onChange={handleChange}
                     placeholder="Sua cidade"
                     className="w-full pl-10 p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                   />
                </div>
             </div>
          </div>

          <div className="mt-12 flex justify-end">
             <button
               type="submit"
               className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] transition-all"
             >
               <Save size={18} />
               Salvar Alterações
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};
