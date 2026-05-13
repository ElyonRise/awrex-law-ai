import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Scale, User, Bot, Loader2, FileCheck, ShieldAlert, Lock as LockIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function TriageChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Bem-vindo à Triagem Inteligente Aurex Law. Sou seu assistente de infraestrutura jurídica. \n\nPara começarmos, poderia me contar brevemente sobre o seu caso? (Fatos, datas e partes envolvidas).' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: "Você é o assistente de triagem da Aurex Law. Sua função é entrevistar clientes interessados em serviços jurídicos de forma profissional e acolhedora. Extraia fatos, datas e partes interessadas. Lembre-se: Você NÃO dá conselhos jurídicos. Você apenas organiza a infraestrutura administrativa para o advogado. O final da triagem deve conter um resumo estruturado." }]
          },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ]
      });

      const text = response.text || "Desculpe, não consegui processar seu pedido no momento.";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um problema ao processar seu pedido. Por favor, tente novamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-obsidian flex flex-col items-center px-6 pb-10">
      <div className="max-w-4xl w-full flex flex-col h-[80vh] rounded-3xl bg-carbon border border-white/10 overflow-hidden gold-glow shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
              <Scale className="text-obsidian w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-medium text-white text-lg">Triagem Inteligente IA</h2>
              <p className="text-xs text-gold font-bold uppercase tracking-widest">Protocolo Administrativo Zero</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase">
            Conexão Criptografada
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gold/5 px-6 py-3 border-b border-white/5 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-tight">
            Este assistente automatizado organiza informações administrativas para seu advogado. 
            <strong> Não fornece aconselhamento jurídico</strong>. Todas as informações serão revisadas por um profissional habilitado.
          </p>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gold' : 'bg-white/10'}`}>
                  {m.role === 'user' ? <User className="text-obsidian w-5 h-5" /> : <Bot className="text-gold w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-gold text-obsidian font-medium rounded-tr-none' 
                    : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none prose prose-invert'
                }`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Loader2 className="text-gold w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                <span className="text-xs text-slate-500 italic">Analisando fatos jurídicos...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
          <input 
            type="text" 
            placeholder="Digite aqui os detalhes do seu caso..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-white text-sm focus:outline-none focus:border-gold/50 transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="w-14 h-14 rounded-xl gold-gradient text-obsidian flex items-center justify-center gold-glow hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center gap-6 opacity-30">
        <div className="flex items-center gap-2"><FileCheck className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Protocolo LGPD</span></div>
        <div className="flex items-center gap-2"><LockIcon className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">SSL 256-bit</span></div>
      </div>
    </div>
  );
}
