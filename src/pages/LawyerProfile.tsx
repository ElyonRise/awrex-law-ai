import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MessageSquare, Briefcase, Star, 
  MapPin, ShieldCheck, Mail, Phone, Calendar,
  ArrowRight, FileCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function LawyerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for the specific profile
  const profile = {
    name: "Dr. Roberto Silva",
    specialties: ["Civil", "Digital", "Empresarial"],
    rating: 4.9,
    oab: "SP 123456",
    plan: "ELITE",
    bio: "Especialista em Direito Digital e Civil com mais de 15 anos de atuação em grandes causas corporativas e proteção de dados.",
    location: "São Paulo, SP",
    cases: 142,
    satisfiedClients: 89,
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-gold transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para a busca
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-carbon rounded-3xl border border-white/5 p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[40px] rounded-full" />
             
             <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center text-gold text-5xl font-display font-bold border border-white/10 shadow-2xl">
                  {profile.name.charAt(4)}
                </div>
                {profile.plan === 'ELITE' && (
                  <div className="absolute -bottom-2 -right-2 bg-gold p-2 rounded-xl border-4 border-carbon">
                    <ShieldCheck className="w-6 h-6 text-obsidian" />
                  </div>
                )}
             </div>

             <h2 className="text-2xl font-display font-medium text-white mb-2">{profile.name}</h2>
             <p className="text-sm text-slate-500 mb-6">{profile.oab}</p>

             <div className="flex items-center justify-center gap-1 text-gold mb-8">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-gold" />)}
                <span className="ml-2 text-sm font-bold">{profile.rating}</span>
             </div>

             <div className="space-y-4">
                <button className="w-full py-4 rounded-xl gold-gradient text-obsidian font-bold text-sm gold-glow flex items-center justify-center gap-2">
                   <MessageSquare className="w-4 h-4" /> Solicitar Consulta
                </button>
                <div className="flex gap-2">
                   <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-white p-2">
                      <Mail className="w-5 h-5 mx-auto" />
                   </button>
                   <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-white p-2">
                      <Phone className="w-5 h-5 mx-auto" />
                   </button>
                </div>
             </div>
          </div>

          <div className="bg-carbon rounded-3xl border border-white/5 p-6">
             <h3 className="text-white font-display font-medium mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" /> Localização
             </h3>
             <p className="text-sm text-slate-400">{profile.location}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
             <h3 className="text-2xl font-display font-medium text-white mb-6">Sobre o Profissional</h3>
             <p className="text-slate-400 leading-relaxed text-lg">
                {profile.bio}
             </p>
          </section>

          <section>
             <h3 className="text-xl font-display font-medium text-white mb-6">Áreas de Especialização</h3>
             <div className="flex flex-wrap gap-3">
                {profile.specialties.map(spec => (
                  <span key={spec} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 font-bold text-xs uppercase tracking-widest">
                    {spec}
                  </span>
                ))}
             </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <Briefcase className="w-8 h-8 text-gold mb-4" />
                <h4 className="text-white font-display font-medium mb-1">Experiência Real</h4>
                <p className="text-3xl font-display font-bold text-white mb-1">+{profile.cases}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Casos Finalizados</p>
             </div>
             <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <FileCheck className="w-8 h-8 text-gold mb-4" />
                <h4 className="text-white font-display font-medium mb-1">Aprovação</h4>
                <p className="text-3xl font-display font-bold text-white mb-1">{profile.satisfiedClients}%</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Clientes Satisfeitos</p>
             </div>
          </section>

          <section className="bg-gold/5 border border-gold/20 rounded-3xl p-8 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center">
                   <Calendar className="w-7 h-7 text-obsidian" />
                </div>
                <div>
                   <h4 className="text-white font-display font-medium">Agendar Reunião</h4>
                   <p className="text-sm text-slate-500">Horários disponíveis para esta semana.</p>
                </div>
             </div>
             <button className="px-8 py-3 rounded-xl bg-gold text-obsidian font-bold text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                Ver Agenda <ArrowRight className="w-4 h-4" />
             </button>
          </section>
        </div>
      </div>
    </div>
  );
}
