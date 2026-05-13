import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import { 
  BarChart3, Users, Briefcase, Clock, Calendar, 
  Search, Bell, Shield, FileText, ChevronRight,
  TrendingUp, Activity, Plus, X, User as UserIcon,
  FolderOpen, Gavel, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full text-left bg-carbon p-6 rounded-3xl border border-white/5 hover:border-gold/20 transition-all group active:scale-95"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gold/10`}>
        <Icon className={`w-6 h-6 text-gold`} />
      </div>
      <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-display font-bold text-white mt-1">{value}</h4>
  </button>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCase, setNewCase] = useState({ title: '', client: '', priority: 'Média', description: '' });
  const [casesList, setCasesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCasesList(data);
    } catch (err) {
      console.error("Erro ao buscar casos:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase),
      });
      const data = await res.json();
      setCasesList([data, ...casesList]);
      setShowNewCaseModal(false);
      setNewCase({ title: '', client: '', priority: 'Média', description: '' });
    } catch (err) {
      alert("Erro ao criar caso");
    }
  };

  const handleDeleteCase = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja apagar este caso permanentemente?")) return;

    try {
      const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCasesList(casesList.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Erro ao apagar caso");
    }
  };

  const isAdvogado = user?.role === 'ADVOGADO';

  if (!isAdvogado) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-medium text-white mb-2">Seu Painel de Justiça</h2>
          <p className="text-slate-400">Olá, <span className="text-gold font-medium">{user?.name}</span>. O que você precisa hoje?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link to="/discovery" className="group p-8 rounded-3xl bg-carbon border border-white/5 hover:border-gold/30 transition-all gold-glow flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search className="text-obsidian w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-medium text-white mb-4">Encontrar Advogado</h3>
            <p className="text-slate-500 mb-6">Busque profissionais por especialidade e proximidade geográfica.</p>
            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs">
              Explorar Mapa <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link to="/triage" className="group p-8 rounded-3xl bg-carbon border border-white/5 hover:border-gold/30 transition-all flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="text-gold w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-medium text-white mb-4">Iniciar Triagem IA</h3>
            <p className="text-slate-500 mb-6">Descreva seu caso para nosso assistente virtual e antecipe sua defesa.</p>
            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs">
              Começar Agora <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Client Active Cases */}
        <div className="bg-carbon rounded-3xl border border-white/5 overflow-hidden shadow-xl mb-12">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h3 className="font-display font-medium text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold" /> Meus Casos em Andamento
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {casesList.slice(0, 1).map((c) => (
              <Link to={`/case/${c.id}`} key={c.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <FileText className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{c.title}</h4>
                    <p className="text-xs text-slate-500">Status: <span className="text-white">{c.status}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Documentos</p>
                    <p className="text-xs text-white font-medium">{c.documents?.length || 0} Arquivos</p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteCase(e, c.id)}
                    className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                    title="Excluir Caso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-gold transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-carbon rounded-3xl border border-white/5 p-8 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-gold/10">
                 <Shield className="text-gold w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-white font-display font-medium">Todos os seus dados estão seguros</h4>
                 <p className="text-xs text-slate-500">Conformidade total com a LGPD e criptografia ponta-a-ponta.</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-display font-medium text-white mb-2">Painel Aurex</h2>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-slate-400">
              Bem-vindo de volta, <span className="text-gold font-medium">Dr(a). {user?.name}</span>.
            </p>
            <div className="flex gap-2">
              {user?.specialties?.map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-bold text-gold uppercase tracking-widest">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-carbon border border-white/5">
            <Search className="w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Buscar caso ou documento..." className="bg-transparent text-xs focus:outline-none text-white w-40" />
          </div>
          <button className="p-3 rounded-xl bg-carbon border border-white/5 relative hover:border-gold/30 transition-colors">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-gold rounded-full border-2 border-carbon" />
          </button>
          <button 
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient text-obsidian font-bold text-sm gold-glow hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Novo Caso
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Casos Ativos" value={casesList.length} icon={Briefcase} color="gold" onClick={() => {}} />
        <StatCard title="Triagens Novas" value="08" icon={Activity} color="gold" onClick={() => navigate('/triage-manager')} />
        <StatCard title="Horas Billable" value="142h" icon={Clock} color="gold" onClick={() => {}} />
        <StatCard title="Receita (Mês)" value="R$ 14.280" icon={BarChart3} color="gold" onClick={() => {}} />
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-carbon rounded-3xl border border-white/5 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h3 className="font-display font-medium text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-gold" /> Casos Recentes
            </h3>
            <button className="text-[10px] font-black text-gold hover:underline uppercase tracking-[0.2em]">Ver Todos</button>
          </div>
          <div className="divide-y divide-white/5">
            {casesList.map((c) => (
              <Link to={`/case/${c.id}`} key={c.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <FileText className="w-6 h-6 text-slate-500 group-hover:text-gold transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{c.title}</h4>
                    <p className="text-xs text-slate-500">{c.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                      c.status === 'Priority' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Prioridade {c.priority}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteCase(e, c.id)}
                    className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-gold transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Triagem Quick Access */}
          <Link to="/triage" className="block p-6 rounded-3xl bg-gold/5 border border-gold/10 hover:border-gold/30 transition-all gold-glow group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gold text-obsidian">
                <Activity className="w-5 h-5" />
              </div>
              <ChevronRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-white font-display font-medium mb-1">Acessar Triagem IA</h4>
            <p className="text-xs text-slate-500">Converta conversas em novos casos instantaneamente.</p>
          </Link>

          {/* Calendar Widget */}
          <div className="bg-carbon p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-medium text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" /> Prazos
              </h3>
              <span className="text-[10px] bg-gold/10 text-gold px-2 py-1 rounded-full font-bold uppercase tracking-widest">Hoje</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Prazo Fatal</p>
                <p className="text-sm text-white font-medium">Réplica - Processo 003421-92</p>
              </div>
            </div>
          </div>

          {/* Secure Vault Info */}
          <button className="w-full text-left bg-gold/10 p-6 rounded-3xl border border-gold/20 relative overflow-hidden group active:scale-95 transition-all">
             <Shield className="w-12 h-12 text-gold/20 absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
             <h3 className="font-display font-medium text-gold mb-2 flex items-center gap-2">
               <FolderOpen className="w-4 h-4" /> Vault Criptografado
             </h3>
             <p className="text-xs text-gold/70 leading-relaxed mb-4">
               Criptografia AES-256 ativa.
             </p>
             <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">2.4 GB / 10 GB</span>
                <div className="h-1 w-24 bg-gold/10 rounded-full overflow-hidden">
                   <div className="h-full bg-gold w-[24%]" />
                </div>
             </div>
          </button>
        </div>
      </div>

      {/* New Case Modal */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-carbon border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <h3 className="font-display font-medium text-white flex items-center gap-2 text-xl">
                  <Plus className="w-5 h-5 text-gold" /> Novo Caso Manual
                </h3>
                <button onClick={() => setShowNewCaseModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateCase} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Título do Caso</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Inventário Família X"
                    value={newCase.title}
                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-gold/50 transition-all font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nome do Cliente</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      required
                      type="text" 
                      placeholder="Nome completo"
                      value={newCase.client}
                      onChange={(e) => setNewCase({ ...newCase, client: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-gold/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Prioridade</label>
                   <div className="flex gap-4">
                      {['Baixa', 'Média', 'Alta'].map(p => (
                        <button 
                          key={p}
                          type="button"
                          onClick={() => setNewCase({ ...newCase, priority: p })}
                          className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            newCase.priority === p ? 'bg-gold/10 border-gold text-gold' : 'bg-black/40 border-white/5 text-slate-500'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                   </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl gold-gradient text-obsidian font-bold text-lg gold-glow hover:brightness-110 transition-all shadow-xl"
                >
                  Confirmar Abertura de Caso
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

