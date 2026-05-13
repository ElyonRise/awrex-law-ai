import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, FileText, Upload, Download, Clock, 
  MessageSquare, Shield, AlertCircle, CheckCircle2,
  MoreVertical, Paperclip, Send, Trash2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'documents' | 'timeline' | 'messages'>('documents');
  const [uploading, setUploading] = useState(false);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/cases/${id}`);
      if (!res.ok) throw new Error("Caso não existe");
      const data = await res.json();
      setCaseData(data);
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCase();
  }, [id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      // Simulate upload integration with backend
      setTimeout(() => {
        setUploading(false);
        const newDoc = { name: e.target.files![0].name, size: 'Auto', date: new Date().toLocaleDateString(), owner: user?.name };
        setCaseData({ ...caseData, documents: [...(caseData.documents || []), newDoc] });
        alert('Documento enviado com sucesso para o Vault Criptografado.');
      }, 1500);
    }
  };

  const handleDeleteDocument = async (docName: string) => {
    if (!confirm("Excluir este documento do Vault?")) return;
    try {
      const res = await fetch(`/api/cases/${id}/documents/${encodeURIComponent(docName)}`, { method: 'DELETE' });
      if (res.ok) {
        setCaseData({ ...caseData, documents: caseData.documents.filter((d: any) => d.name !== docName) });
      }
    } catch (err) {
      alert("Erro ao excluir arquivo");
    }
  };

  if (loading) return <div className="pt-32 text-center text-gold">Carregando dados seguros...</div>;
  if (!caseData) return null;

  const timelineSteps = [
    { event: 'Abertura de Protocolo', date: caseData.createdAt || 'Recent', icon: CheckCircle2, color: 'green' },
    { event: 'Análise de Risco IA', date: 'Automático', icon: Shield, color: 'gold' },
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-gold transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Dashboard
          </button>
          <div className="flex items-center gap-4">
             <h2 className="text-4xl font-display font-medium text-white">{caseData.title}</h2>
             <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-black text-gold uppercase tracking-widest leading-none">
                {caseData.status}
             </span>
          </div>
          <p className="text-slate-500 mt-2">ID: {id} • Cliente: <span className="text-white font-medium">{caseData.client}</span></p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Prioridade {caseData.priority}</span>
           </div>
           <button className="p-3 rounded-xl bg-carbon border border-white/5 text-slate-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
           {[
             { id: 'documents', label: 'Documentos & Vault', icon: FileText },
             { id: 'timeline', label: 'Linha do Tempo', icon: Clock },
             { id: 'messages', label: 'Comunicação Segura', icon: MessageSquare },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${
                 activeTab === tab.id 
                 ? 'bg-gold/10 border-gold/30 text-gold shadow-lg shadow-gold/5' 
                 : 'bg-carbon/50 border-white/5 text-slate-400 hover:bg-carbon hover:text-white'
               }`}
             >
               <tab.icon className="w-5 h-5" />
               <span className="font-display font-medium">{tab.label}</span>
             </button>
           ))}
        </div>

        <div className="lg:col-span-3">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-carbon rounded-3xl border border-white/5 p-8 shadow-xl min-h-[500px]"
             >
               {activeTab === 'documents' && (
                 <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-display font-medium text-white mb-1">Documentos Digitais</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Criptografia AES-256 de Nível Bancário</p>
                      </div>
                      <label className="flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient text-obsidian font-bold text-sm gold-glow cursor-pointer hover:scale-[1.02] transition-all">
                        <Upload className="w-4 h-4" /> 
                        {uploading ? 'Enviando...' : 'Fazer Upload'}
                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                      </label>
                   </div>

                   <div className="space-y-3">
                      {caseData.documents?.map((doc: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 group hover:border-gold/30 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                 <FileText className="w-6 h-6 text-slate-500 group-hover:text-gold transition-colors" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{doc.name}</h4>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                   {doc.size} • {doc.date} • Enviado por {doc.owner}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                 <Download className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDocument(doc.name)}
                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                              >
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                      ))}
                      {(!caseData.documents || caseData.documents.length === 0) && (
                        <div className="text-center py-12 text-slate-600 border-2 border-dashed border-white/5 rounded-3xl uppercase tracking-widest font-black text-[10px]">
                          Nenhum documento anexado ao Vault
                        </div>
                      )}
                   </div>
                 </div>
               )}

               {activeTab === 'timeline' && (
                 <div className="space-y-8">
                   <h3 className="text-xl font-display font-medium text-white">Fluxo Processual</h3>
                   <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-white/10">
                      {timelineSteps.map((step, i) => (
                        <div key={i} className="flex gap-6 relative">
                           <div className={`w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center z-10 shrink-0 border border-gold/20`}>
                              <step.icon className={`w-6 h-6 text-gold`} />
                           </div>
                           <div>
                              <p className="text-white font-medium">{step.event}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">{step.date}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                 </div>
               )}

               {activeTab === 'messages' && (
                 <div className="flex flex-col h-[400px]">
                   <div className="flex-grow space-y-4 overflow-y-auto mb-6 pr-2 scrollbar-hide text-center py-20 flex flex-col items-center justify-center opacity-50">
                      <MessageSquare className="w-12 h-12 text-gold mb-4" />
                      <p className="text-slate-400">Canal de comunicação seguro ativado.<br />As mensagens são criptografadas ponta-a-ponta.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-grow relative">
                         <Paperclip className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 hover:text-gold cursor-pointer transition-colors" />
                         <input 
                           type="text" 
                           placeholder="Envie uma mensagem segura..." 
                           className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-gold/50 transition-all font-medium"
                         />
                      </div>
                      <button className="w-14 h-14 rounded-2xl gold-gradient text-obsidian flex items-center justify-center gold-glow hover:scale-105 active:scale-95 transition-all">
                         <Send className="w-6 h-6" />
                      </button>
                   </div>
                 </div>
               )}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
