import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Star, Shield } from 'lucide-react';
import { useAuth } from '../AuthContext';

const plans = [
  {
    name: 'Essential',
    price: '297',
    description: 'Gestão básica para advogados autônomos.',
    features: [
      'Até 15 casos ativos',
      '3 especialidades OAB',
      'Vault de documentos básico',
      'Triagem IA básica',
      'Suporte via email'
    ],
    priceId: 'price_essential_id', // Mock price ID
    icon: Shield,
    color: 'slate'
  },
  {
    name: 'Professional',
    price: '697',
    description: 'A escolha ideal para escritórios em crescimento.',
    features: [
      'Casos ilimitados',
      'IA de Resumo Avançado',
      'Alertas de prazo inteligentes',
      'Prioridade Geográfica',
      'Suporte via WhatsApp',
      'Dashboard Financeiro'
    ],
    priceId: 'price_professional_id', // Mock price ID
    featured: true,
    icon: Zap,
    color: 'gold'
  },
  {
    name: 'Elite',
    price: '1.297',
    description: 'Infraestrutura completa para grandes bancas.',
    features: [
      'Até 5 usuários',
      'White-label (Seu Logo)',
      'IA de Risco Antecipado',
      'Suporte Priority 24/7',
      'Armazenamento ilimitado',
      'Relatórios Premium'
    ],
    priceId: 'price_elite_id', // Mock price ID
    icon: Star,
    color: 'amber'
  }
];

export default function Pricing() {
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planPriceId: priceId, userId: user?.id || 'guest' }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert('Erro ao iniciar checkout. Verifique sua conexão.');
    }
  };

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-5xl font-display font-medium text-white mb-4"
        >
          Escolha o nível da sua <span className="text-gold">infraestrutura</span>
        </motion.h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Planos projetados para advogados que não aceitam nada menos que a excelência administrativa.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-3xl bg-carbon border ${
              plan.featured ? 'border-gold gold-glow' : 'border-white/5'
            } flex flex-col h-full hover:border-gold/30 transition-all`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gold-gradient text-obsidian text-[10px] font-black uppercase tracking-widest">
                Mais Popular
              </div>
            )}
            
            <div className="mb-8">
              <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${plan.featured ? 'bg-gold' : 'bg-white/10'}`}>
                <plan.icon className={plan.featured ? 'text-obsidian' : 'text-gold'} />
              </div>
              <h3 className="text-2xl font-display font-medium text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-slate-400">R$</span>
                <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                <span className="text-sm text-slate-400">/ mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe(plan.priceId)}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                plan.featured 
                ? 'gold-gradient text-obsidian gold-glow hover:brightness-110' 
                : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Assinar Agora
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
