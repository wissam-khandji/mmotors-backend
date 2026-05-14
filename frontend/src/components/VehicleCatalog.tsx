import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Vehicle } from '../types/auth';
import { 
  Car, 
  Fuel, 
  Gauge, 
  Zap, 
  Loader2, 
  Calendar, 
  Banknote, 
  AlertCircle, 
  Key, 
  ShoppingBag, 
  Search, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Composant Catalogue pour les clients - Données réelles API (LLD & Vente)
 */
const VehicleCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'LOCATION' | 'VENTE'>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await api.get<Vehicle[]>('/vehicles');
        setVehicles(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des véhicules:', err);
        setError('Impossible de charger le catalogue. Vérifiez que le serveur est lancé.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Logique de filtrage optimisée
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchSearch = 
        vehicle.marque.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vehicle.modele.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = 
        categoryFilter === 'ALL' || vehicle.categorie === categoryFilter;
      
      const matchPrice = vehicle.prix <= maxPrice;

      return matchSearch && matchCategory && matchPrice;
    });
  }, [vehicles, searchTerm, categoryFilter, maxPrice]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 animate-pulse font-medium">Chargement du parc M-Motors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex items-center gap-4 text-red-700 shadow-sm">
        <AlertCircle size={28} />
        <div>
          <p className="font-bold">Erreur de connexion</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catalogue M-Motors</h2>
          <p className="text-slate-500 mt-1">Découvrez nos solutions de Location Longue Durée et Vente.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Barre de recherche */}
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Chercher une BMW, Audi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-sm shadow-sm"
            />
          </div>

          {/* Filtres de catégorie */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            {(['ALL', 'LOCATION', 'VENTE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`
                  px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${categoryFilter === cat 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                {cat === 'ALL' ? 'Tout' : cat === 'LOCATION' ? 'LLD' : 'Vente'}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
               <Banknote size={18} />
            </div>
            <select 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="pl-12 pr-8 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-sm shadow-sm appearance-none cursor-pointer"
            >
              <option value={1000000}>Prix Max</option>
              <option value={500}>&lt; 500€ /mois</option>
              <option value={1000}>&lt; 1000€ /mois</option>
              <option value={20000}>&lt; 20 000€</option>
              <option value={50000}>&lt; 50 000€</option>
              <option value={100000}>&lt; 100 000€</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredVehicles.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="absolute top-10 left-10"><Car size={40} /></div>
              <div className="absolute bottom-10 right-10"><Search size={40} /></div>
            </div>
            
            <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Aucun résultat trouvé</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Nous n'avons pas trouvé de véhicule correspondant à vos critères de recherche.</p>
            <button 
              onClick={() => {setSearchTerm(''); setCategoryFilter('ALL'); setMaxPrice(1000000);}}
              className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-50"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredVehicles.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100 }}
                onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative cursor-pointer"
              >
                {/* Image avec prix dynamique */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-50">
                  <img 
                    src={vehicle.imagePath || `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400`} 
                    alt={`${vehicle.marque} ${vehicle.modele}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Badge de catégorie sur l'image */}
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 backdrop-blur-md border ${vehicle.categorie === 'LOCATION' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-blue-600/90 text-white border-blue-400'}`}>
                    {vehicle.categorie === 'LOCATION' ? <Key size={12} /> : <ShoppingBag size={12} />}
                    {vehicle.categorie === 'LOCATION' ? 'LLD' : 'Achat'}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-slate-900 font-black text-base shadow-xl border border-white/20">
                    {vehicle.prix.toLocaleString()}€
                    {vehicle.categorie === 'LOCATION' && <span className="text-[10px] text-slate-400 font-bold ml-1">/mois</span>}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-slate-900 text-xl tracking-tight leading-tight uppercase">
                        {vehicle.marque} <span className={vehicle.categorie === 'LOCATION' ? 'text-emerald-600' : 'text-blue-600'}>{vehicle.modele}</span>
                      </h3>
                      <div className="p-2 bg-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <Calendar size={14} className="text-slate-300" />
                        <span>{vehicle.annee}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <Gauge size={14} className="text-slate-300" />
                        <span>{vehicle.kilometrage?.toLocaleString()} KM</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                      <Fuel size={16} className="text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{vehicle.energie || 'Non renseignée'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                      <Zap size={16} className="text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{vehicle.transmission || 'Non renseignée'}</span>
                    </div>
                  </div>

                  <button className={`
                    w-full mt-auto py-4 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2
                    ${vehicle.categorie === 'LOCATION' ? 'bg-slate-900 hover:bg-emerald-600 shadow-emerald-100' : 'bg-slate-900 hover:bg-blue-600 shadow-blue-100'}
                  `}>
                    <Car size={18} />
                    VOIR L'OFFRE
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleCatalog;
