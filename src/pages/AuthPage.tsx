import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Scale, Mail, Lock, User, Briefcase, Hash } from 'lucide-react';

interface AuthPageProps {
  type: 'login' | 'register';
}

export default function AuthPage({ type }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [oab, setOab] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [role, setRole] = useState<'ADVOGADO' | 'CLIENTE'>(type === 'register' ? 'ADVOGADO' : 'CLIENTE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const specialtiesOptions = [
    'Civil', 'Penal', 'Trabalhista', 'Tributário', 
    'Família', 'Empresarial', 'Previdenciário', 'Digital',
    'Ambiental', 'Imobiliário'
  ];

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty) 
        : [...prev, specialty]
    );
  };
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (type === 'register' && role === 'ADVOGADO') {
      const oabRegex = /^[A-Z]{2}\s\d{4,8}$/;
      if (!oabRegex.test(oab)) {
        setError("Formato de OAB inválido. Use UF + Número (Ex: SP 123456)");
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = type === 'login' 
        ? { email, password } 
        : { 
            email, 
            password, 
            name, 
            role, 
            oab: role === 'ADVOGADO' ? oab : undefined,
            specialties: role === 'ADVOGADO' ? selectedSpecialties : undefined
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ocorreu um erro');

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full -z-10 h-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-carbon border border-white/10 gold-glow"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold mx-auto flex items-center justify-center mb-6 shadow-xl shadow-gold/20">
            <Scale className="text-obsidian w-8 h-8" />
          </div>
          <h2 className="text-3xl font-display font-medium text-white mb-2">
            {type === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta premium'}
          </h2>
          <p className="text-slate-400">
            {type === 'login' 
              ? 'Acesse sua infraestrutura jurídica agora.' 
              : 'Junte-se à elite dos advogados modernos.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          {type === 'register' && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Seu Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all font-medium"
                  required
                />
              </div>

              <div className="flex gap-4 mb-4">
                <button 
                  type="button"
                  onClick={() => setRole('ADVOGADO')}
                  className={`flex-1 p-4 rounded-xl border ${role === 'ADVOGADO' ? 'bg-gold/10 border-gold/50 text-gold' : 'bg-black/40 border-white/5 text-slate-500'} transition-all flex flex-col items-center gap-2`}
                >
                  <Briefcase className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Advogado</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('CLIENTE')}
                  className={`flex-1 p-4 rounded-xl border ${role === 'CLIENTE' ? 'bg-gold/10 border-gold/50 text-gold' : 'bg-black/40 border-white/5 text-slate-500'} transition-all flex flex-col items-center gap-2`}
                >
                  <User className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cliente</span>
                </button>
              </div>

              {role === 'ADVOGADO' && (
                <>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Número OAB (UF + Número)"
                      value={oab}
                      onChange={(e) => setOab(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Especialidades OAB</label>
                    <div className="flex flex-wrap gap-2">
                      {specialtiesOptions.map(spec => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => toggleSpecialty(spec)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            selectedSpecialties.includes(spec)
                              ? 'bg-gold/20 border-gold text-gold'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              placeholder="Email profissional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all font-medium"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all font-medium"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-xl gold-gradient text-obsidian font-bold text-lg gold-glow hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading ? 'Processando...' : type === 'login' ? 'Acessar Painel' : 'Criar Conta Premium'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to={type === 'login' ? '/register' : '/login'} 
            className="text-sm font-medium text-slate-500 hover:text-gold transition-colors"
          >
            {type === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre aqui'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
