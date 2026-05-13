import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Scale, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-obsidian/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center gold-glow transition-transform group-hover:scale-105">
            <Scale className="text-obsidian w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white leading-none">AUREX LAW</h1>
            <p className="text-[10px] text-gold tracking-[0.2em] font-medium uppercase mt-0.5">Infraestrutura</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/pricing" className="text-sm font-medium hover:text-gold transition-colors">Planos</Link>
          <Link to="/triage" className="text-sm font-medium hover:text-gold transition-colors">Triagem IA</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-carbon text-sm font-medium border border-white/5 hover:border-gold/30 transition-all"
              >
                <UserIcon className="w-4 h-4 text-gold" />
                Painel
              </Link>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Entrar</Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 rounded-full gold-gradient text-obsidian font-bold text-sm gold-glow hover:brightness-110 transition-all"
              >
                Sou Advogado
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden p-2">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>
    </nav>
  );
}
