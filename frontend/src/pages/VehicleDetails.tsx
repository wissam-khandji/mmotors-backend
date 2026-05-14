import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Vehicle } from '../types/auth';
import { 
  ChevronLeft, 
  Car, 
  Fuel, 
  Gauge, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Key, 
  ShoppingBag,
  Loader2,
  AlertCircle,
  Phone,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await api.get<Vehicle>(`/vehicles/${id}`);
        setVehicle(response.data);
      } catch (err) {
        console.error('Erreur détails véhicule:', err);
        setError('Impossible de trouver ce véhicule.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Chargement du bolide...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center"
        >
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Véhicule introuvable</h2>
          <p className="text-slate-500 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
          >
            Retour au catalogue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Navigation Rapide */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-[10px] mb-8 group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <ChevronLeft size={16} />
          </div>
          Retour au catalogue
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Section Image - Gauche */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white p-4 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
          >
            <div className="aspect-[4/3] rounded-[2.8rem] overflow-hidden bg-slate-50 relative">
              <img 
                src={vehicle.imagePath || `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200`} 
                alt={`${vehicle.marque} ${vehicle.modele}`}
                className="w-full h-full object-cover"
              />
              
              {/* Badge flottant sur l'image */}
              <div className="absolute bottom-6 left-6 p-1 bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl">
                <div className="bg-white/90 px-6 py-3 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">M-Motors Select</p>
                  <p className="text-slate-900 font-black text-xl leading-none">VÉHICULE CERTIFIÉ</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section Infos - Droite */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border flex items-center gap-2 shadow-sm ${vehicle.categorie === 'LOCATION' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                  {vehicle.categorie === 'LOCATION' ? <Key size={14} /> : <ShoppingBag size={14} />}
                  {vehicle.categorie === 'LOCATION' ? 'LLD - Éligible au contrat d\'entretien' : 'Achat comptant - Garantie 12 mois'}
                </span>
                <span className="px-5 py-2 rounded-full text-[10px] font-black bg-slate-900 text-white uppercase tracking-[0.15em] shadow-lg shadow-slate-200">
                  {vehicle.statut || 'DISPONIBLE'}
                </span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">
                  {vehicle.marque} <span className="block text-blue-600">{vehicle.modele}</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Référence : MM-{vehicle.id?.toString().slice(-4) ?? '----'}</p>
              </div>
              
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix de l'offre</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">{vehicle.prix.toLocaleString()}€</span>
                    {vehicle.categorie === 'LOCATION' && <span className="text-slate-400 font-black uppercase tracking-widest text-xs">/ MOIS TTC</span>}
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck size={32} />
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 gap-4">
              <DetailCard icon={<Calendar size={20} />} label="Mise en circulation" value={vehicle.annee.toString()} />
              <DetailCard icon={<Gauge size={20} />} label="Usage" value={`${vehicle.kilometrage.toLocaleString()} KM`} />
              <DetailCard icon={<Fuel size={20} />} label="Énergie" value={vehicle.energie || 'Non renseignée'} />
              <DetailCard icon={<Zap size={20} />} label="Transmission" value={vehicle.transmission || 'Non renseignée'} />
            </div>

            {/* Actions Contextuelles */}
            <div className="flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-900 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                    <Phone size={16} className="text-blue-600" />
                    Contacter un conseiller
                  </button>
                  <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-900 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                    <CalendarDays size={16} className="text-blue-600" />
                    Demander un essai
                  </button>
               </div>

               <button className={`
                  w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] text-xs transition-all active:scale-95 shadow-2xl relative overflow-hidden group
                  ${vehicle.categorie === 'LOCATION' ? 'bg-slate-900 text-white shadow-emerald-200' : 'bg-blue-600 text-white shadow-blue-200'}
               `}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl ${vehicle.categorie === 'LOCATION' ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {vehicle.categorie === 'LOCATION' ? 'Démarrer mon dossier LLD' : 'Reserver pour achat'}
                    <ChevronLeft className="rotate-180" size={18} />
                  </span>
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 hover:border-blue-200 hover:shadow-lg transition-all group">
    <div className="text-slate-300 group-hover:text-blue-500 transition-colors">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="font-bold text-slate-900 text-sm">{value}</p>
    </div>
  </div>
);

export default VehicleDetails;
