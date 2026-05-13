import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Target, ArrowRight, CheckCircle2, Globe, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8"
          >
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold text-gold tracking-wider uppercase">Infraestrutura Jurídica Premium</span>
          </motion.div>
          
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-5xl lg:text-7xl font-display font-medium text-white mb-8 tracking-tight"
          >
            Gerencie seu escritório com a<br />
            <span className="text-gold italic">excelência que seu cliente exige.</span>
          </motion.h1>
          
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-2xl mx-auto text-lg text-slate-400 mb-12"
          >
            Gestão administrativa, triagem inteligente com IA e segurança de nível bancário. 
            A Aurex Law é a base tecnológica para advogados de elite.
          </motion.p>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-full gold-gradient text-obsidian font-bold text-lg gold-glow flex items-center gap-2 hover:scale-[1.02] transition-transform"
            >
              Sou Advogado <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/triage" 
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              Fazer Triagem
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-carbon border border-white/5 relative overflow-hidden"
          >
            <div className="relative z-10">
              <Zap className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-display font-medium text-white mb-4">Triagem Inteligente com IA</h3>
              <p className="text-slate-400 max-w-md">
                Nossa IA conduz entrevistas estruturadas, extrai fatos e gera resumos administrativos instantâneos, 
                economizando horas do seu dia.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[60px] rounded-full -mr-20 -mt-20" />
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-carbon border border-white/5"
          >
            <Target className="w-10 h-10 text-gold mb-6" />
            <h3 className="text-2xl font-display font-medium text-white mb-4">Geo-Discovery</h3>
            <p className="text-slate-400">
              Posicionamento estratégico por geolocalização para conectar clientes aos advogados mais próximos.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-carbon border border-white/5"
          >
            <Lock className="w-10 h-10 text-gold mb-6" />
            <h3 className="text-2xl font-display font-medium text-white mb-4">Criptografia AES-256</h3>
            <p className="text-slate-400">
              Seus documentos protegidos por infraestrutura de segurança cibernética avançada e em conformidade com a LGPD.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-carbon border border-white/5 flex items-center justify-between overflow-hidden"
          >
            <div className="max-w-md">
              <Globe className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-display font-medium text-white mb-4">Multi-localidade</h3>
              <p className="text-slate-400">
                Atenda de onde estiver com infraestrutura 100% cloud, sem abrir mão da segurança e conformidade normativa.
              </p>
            </div>
            <div className="hidden lg:block">
               <FileText className="w-32 h-32 text-white/5 rotate-12" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-display font-medium text-white mb-12">Em total conformidade com</h2>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
             <div className="flex items-center gap-2 font-bold text-xl">OAB <span className="text-gold font-normal">Provimento 205/2021</span></div>
             <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest">LGPD</div>
             <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-widest">ISO 27001</div>
          </div>
        </div>
      </section>
    </div>
  );
}
