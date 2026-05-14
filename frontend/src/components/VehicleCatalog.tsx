import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Vehicle } from '../types/auth';
import { Car, Fuel, Gauge, Zap, Loader2, Calendar, Banknote, AlertCircle, Key, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Composant Catalogue pour les clients - Données réelles API (LLD & Vente)
 */
const VehicleCatalog: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catalogue M-Motors</h2>
          <p className="text-slate-500 mt-1">Découvrez nos solutions de Location Longue Durée et Vente.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider">
            <Key size={14} /> LLD
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-wider">
            <ShoppingBag size={14} /> Vente
          </div>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
          <Car className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-slate-900">Le parc est actuellement vide</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">Nous préparons de nouveaux véhicules pour vous. Repassez nous voir très bientôt !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 100 }}
              className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative"
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
                  <h3 className="font-extrabold text-slate-900 text-xl tracking-tight leading-tight uppercase">
                    {vehicle.marque} <span className={vehicle.categorie === 'LOCATION' ? 'text-emerald-600' : 'text-blue-600'}>{vehicle.modele}</span>
                  </h3>
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
                    <span className="text-[10px] font-black uppercase tracking-widest">Hybride</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">BVA</span>
                  </div>
                </div>

                <button className={`
                  w-full mt-auto py-4 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2
                  ${vehicle.categorie === 'LOCATION' ? 'bg-slate-900 hover:bg-emerald-600 shadow-emerald-100' : 'bg-slate-900 hover:bg-blue-600 shadow-blue-100'}
                `}>
                  <Car size={18} />
                  {vehicle.categorie === 'LOCATION' ? 'Louer' : 'Acheter'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleCatalog;
