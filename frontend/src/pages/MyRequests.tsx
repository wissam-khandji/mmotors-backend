import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import type { Dossier, Vehicle } from '../types/auth';
import { 
  ChevronLeft, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Ban, 
  Car, 
  ArrowRight,
  Loader2,
  Inbox
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';

const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyDossiers = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // L'utilisateur demande ses propres dossiers
        const response = await api.get<Dossier[]>(`/dossiers/utilisateur/${user.id}`);
        setDossiers(response.data);
      } catch (err) {
        console.error('Erreur chargement dossiers perso:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDossiers();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate('/')}
               className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400 hover:text-slate-900 transition-all hover:shadow-md"
             >
               <ChevronLeft size={20} />
             </button>
             <div>
               <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Mes Demandes</h1>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Suivi de vos dossiers M-Motors</p>
             </div>
          </div>
          
          <div className="hidden sm:flex bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FileText size={20} />
             </div>
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                {dossiers.length} Demande{dossiers.length > 1 ? 's' : ''} <br/>
                <span className="text-slate-400">enregistrée(s)</span>
             </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
             <Loader2 size={40} className="text-blue-600 animate-spin" />
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Récupération de vos dossiers...</p>
          </div>
        ) : dossiers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-16 border border-slate-100 shadow-sm text-center flex flex-col items-center gap-6"
          >
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                <Inbox size={40} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Aucun dossier en cours</h3>
                <p className="text-slate-400 font-medium mt-1">Parcourez notre catalogue pour démarrer une demande.</p>
             </div>
             <Link 
               to="/"
               className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
             >
               Voir le catalogue
             </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {dossiers.map((d, i) => (
              <motion.div 
                key={d.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col sm:flex-row items-center gap-8 group"
              >
                {/* Image Véhicule */}
                <div className="w-full sm:w-40 h-28 bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 flex-shrink-0">
                   {d.vehicle?.imagePath ? (
                     <img src={d.vehicle.imagePath} alt="Véhicule" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Car size={32} />
                     </div>
                   )}
                </div>

                {/* Infos */}
                <div className="flex-1 w-full space-y-1">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${d.vehicle?.categorie === 'LOCATION' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                         {d.vehicle?.categorie || 'N/A'}
                      </span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Réf : MM-{d.vehicleId}</p>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                      {d.vehicle?.marque || 'Marque'} {d.vehicle?.modele || 'Modèle'}
                   </h3>
                   <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <p>{d.vehicle?.annee ? d.vehicle.annee : '2024'}</p>
                      <p>•</p>
                      <p>{d.vehicle?.prix.toLocaleString()}€{d.vehicle?.categorie === 'LOCATION' ? '/mois' : ''}</p>
                   </div>
                </div>

                {/* Statut */}
                <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
                   <RequestStatusBadge status={d.statut} />
                   { (d.vehicleId || d.vehicle?.id) ? (
                     <Link 
                       to={`/vehicle/${d.vehicleId || d.vehicle?.id}`}
                       className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                     >
                       Voir la fiche
                       <ArrowRight size={14} />
                     </Link>
                   ) : (
                     <button 
                       onClick={() => console.log('Dossier sans ID véhicule:', d)}
                       className="text-[9px] text-rose-300 font-bold uppercase"
                     >
                       ID manquant
                     </button>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const RequestStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'VALIDE':
      return (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">
           <CheckCircle2 size={16} />
           Dossier Approuvé
        </div>
      );
    case 'REFUSE':
      return (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">
           <Ban size={16} />
           Dossier Refusé
        </div>
      );
    case 'EN_COURS':
    default:
      return (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm">
           <Clock size={16} />
           Analyse en cours
        </div>
      );
  }
}

export default MyRequests;
