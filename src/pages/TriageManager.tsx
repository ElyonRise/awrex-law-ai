import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, ArrowLeft, ChevronRight, User as UserIcon, 
  Clock, MessageSquare, Plus, CheckCircle2, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TriageManager() {
  const navigate = useNavigate();

  const triages = [
    { 
      id: '1', 
      client: 'Marcos Vinícius', 
      type: 'Trabalhista', 
      summary: 'Demitido sem justa causa após 4 anos. Horas extras não pagas e desvio de função.',
      time: 'Há 2 horas',
      criticality: 'Alta'
    },
    { 
      id: '2', 
      client: 'Helena Costa', 
      type: 'Civil / Família', 
      summary: 'Ação revisoral de alimentos. Mudança na situação financeira do alimentante.',
      time: 'Há 5 horas',
      criticality: 'Média'
    },
    { 
      id: '3', 
      client: 'Indústria Têxtil Silva', 
      type: 'Empresarial', 
      summary: 'Análise de passivo tributário e planejamento para fusão.',
      time: 'Há 1 dia',
      criticality: 'Alta'
    },
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-gold transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </button>
          <h2 className="text-4xl font-display font-medium text-white flex items-center gap-4">
            <Activity className="text-gold w-10 h-10" /> Gestão de Triagens IA
          </h2>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gold/10 border border-gold/20">
           <Shield className="w-5 h-5 text-gold" />
           <p className="text-xs font-bold text-gold uppercase tracking-widest italic">Processamento IA Criptografado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {triages.map((t, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={t.id}
              className="bg-carbon rounded-3xl border border-white/5 p-8 hover:border-gold/30 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <UserIcon className="w-7 h-7 text-slate-500 group-hover:text-gold transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-medium text-white group-hover:text-gold transition-colors">{t.client}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Clock className="w-3 h-3" /> {t.time}
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  t.criticality === 'Alta' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gold/10 text-gold border border-gold/20'
                }`}>
                  Prioridade {t.criticality}
                </span>
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Resumo Estruturado IA</p>
                <p className="text-slate-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  {t.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                 <button 
                    onClick={() => {
                      alert('Processando dados da triagem IA... Criando Novo Caso no Dashboard.');
                      navigate('/dashboard');
                    }}
                    className="px-6 py-3 rounded-xl gold-gradient text-obsidian font-bold text-sm gold-glow flex items-center gap-2 active:scale-95 transition-all"
                 >
                    <Plus className="w-4 h-4" /> Converter em Caso
                 </button>
                 <button className="px-6 py-3 rounded-xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10">
                    <MessageSquare className="w-4 h-4" /> Ver Conversa na Íntegra
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
           <div className="bg-carbon rounded-3xl border border-white/5 p-8">
              <h3 className="text-lg font-display font-medium text-white mb-6 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-gold" /> Sugestões de Especialistas
              </h3>
              <div className="space-y-6">
                 {[
                   { name: 'Dr. Lucas Ribeiro', match: '98%', area: 'Trabalhista' },
                   { name: 'Dra. Marina Silva', match: '94%', area: 'Civil' }
                 ].map((adv, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-gold/30 transition-all cursor-pointer">
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">{adv.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{adv.area}</p>
                      </div>
                      <span className="text-gold font-display text-sm font-bold italic">{adv.match}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-4 rounded-xl bg-gold/10 border border-gold/20 text-gold font-bold text-xs uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-all">
                 Enviar Convites em Massa
              </button>
           </div>

           <div className="bg-black/40 rounded-3xl border border-white/5 p-8 text-center">
              <Activity className="w-10 h-10 text-gold mx-auto mb-4 opacity-50" />
              <p className="text-slate-500 text-sm">
                Nossa IA analisa <span className="text-white font-medium">semântica e contexto jurídico</span> para garantir que você receba apenas casos qualificados.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
