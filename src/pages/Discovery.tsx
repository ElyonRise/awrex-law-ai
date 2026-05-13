import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Star, ShieldCheck, ArrowRight, Filter, Navigation } from 'lucide-react';
import { User } from '../types';
import { Link } from 'react-router-dom';

export default function Discovery() {
  const [specialty, setSpecialty] = useState('');
  const [radius, setRadius] = useState('50');
  const [query, setQuery] = useState('');
  const [lawyers, setLawyers] = useState<(User & { distance?: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number, long: number } | null>(null);

  const specialtiesOptions = [
    'Civil', 'Penal', 'Trabalhista', 'Tributário', 
    'Família', 'Empresarial', 'Previdenciário', 'Digital'
  ];

  const fetchLawyers = async (lat?: number, long?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (specialty) params.append('specialty', specialty);
      if (query) params.append('q', query);
      if (lat) params.append('lat', lat.toString());
      if (long) params.append('long', long.toString());
      params.append('radius', radius);
      
      const res = await fetch(`/api/lawyers/search?${params.toString()}`);
      const data = await res.json();
      setLawyers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeoDiscovery = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, long: longitude });
        setLocationEnabled(true);
        fetchLawyers(latitude, longitude);
      }, (err) => {
        console.error("Geoloc erro:", err);
        fetchLawyers(); // Fallback without geo
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLawyers(userCoords?.lat, userCoords?.long);
    }, 300); // Small debounce for query
    return () => clearTimeout(timer);
  }, [specialty, radius, query]);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6"
        >
          <Navigation className="w-4 h-4 text-gold" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gold italic">Geo-Discovery Engine 2.0</span>
        </motion.div>
        <h2 className="text-4xl lg:text-5xl font-display font-medium text-white mb-4">
          Conexão Jurídica <span className="text-gold italic">de Alta Precisão</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Localize especialistas por nome, OAB, especialidade ou proximidade geográfica com nossa infraestrutura de busca avançada.
        </p>
      </div>

      {/* Advanced Search Bar */}
      <div className="max-w-4xl mx-auto mb-12 space-y-4">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por Nome ou Número OAB..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-carbon border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-white text-lg focus:outline-none focus:border-gold/50 gold-glow transition-all"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              value={specialty} 
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-carbon border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-gold/50 font-medium"
            >
              <option value="">Especialidades</option>
              {specialtiesOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {locationEnabled && (
            <div className="relative w-full md:w-40">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-carbon border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-gold/50 font-medium"
              >
                <option value="5">Raio 5km</option>
                <option value="10">Raio 10km</option>
                <option value="25">Raio 25km</option>
                <option value="50">Raio 50km</option>
                <option value="100">100km</option>
              </select>
            </div>
          )}
          
          <button 
            onClick={handleGeoDiscovery}
            className={`px-8 py-4 rounded-xl flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${
              locationEnabled ? 'bg-gold text-obsidian gold-glow' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            <MapPin className="w-5 h-5" />
            {locationEnabled ? 'Geo Ativa' : 'Ativar Geo'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full py-20 text-center text-slate-500">Buscando advogados...</div>
          ) : lawyers.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500">Nenhum advogado encontrado com estes filtros.</div>
          ) : lawyers.map((lawyer, i) => (
            <motion.div
              layout
              key={lawyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-carbon rounded-3xl border border-white/5 p-6 hover:border-gold/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gold font-display text-2xl font-bold">
                    {lawyer.name.charAt(0)}
                  </div>
                  {lawyer.plan === 'ELITE' && (
                    <div className="absolute -top-2 -right-2 bg-gold p-1 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-obsidian" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-gold mb-1">
                    <Star className="w-4 h-4 fill-gold" />
                    <span className="text-sm font-bold">{lawyer.rating}</span>
                  </div>
                  {lawyer.distance !== undefined && (
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      A {Math.round(lawyer.distance)} KM
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-xl font-display font-medium text-white mb-1 group-hover:text-gold transition-colors">{lawyer.name}</h4>
              <p className="text-xs text-slate-500 mb-4">{lawyer.oab || 'OAB Não Informada'}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {lawyer.specialties?.map(s => (
                  <span key={s} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {s}
                  </span>
                ))}
              </div>

              <Link 
                to={`/profile/${lawyer.id}`}
                className="w-full py-3 rounded-xl bg-white/5 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold hover:text-obsidian transition-all"
              >
                Ver Perfil <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
