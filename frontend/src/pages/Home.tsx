import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdminDashboard from '../components/AdminDashboard';
import VehicleCatalog from '../components/VehicleCatalog';
import { Shield, LayoutGrid, Loader2, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Page d'accueil avec détection de rôle robuste (ADMIN vs CLIENT)
 */
const Home: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }
  
  // Logique robuste : Un admin a soit le rôle 'ADMIN' soit 'ROLE_ADMIN'
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec Badge de débugging */}
        <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Bienvenue, <span className="text-blue-600">{(user?.email || '').split('@')[0] || 'Utilisateur'}</span>
            </h1>
            <p className="text-slate-500 mt-1 italic">M-Motors Fleet Management Platform</p>
          </motion.div>

          {/* Badge de débogage du rôle */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm self-start">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compte :</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isAdmin ? 'ADMINISTRATEUR' : 'CLIENT'}
            </span>
          </div>
        </section>

        {/* Bannière de contexte visuel */}
        <section className="mb-10">
          {isAdmin ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Shield size={120} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <Shield className="text-blue-500" /> 
                  Mode Administrateur
                </h2>
                <p className="text-slate-400 max-w-md">
                  Vous avez accès à tous les outils de gestion du parc : ajout, modification et suppression des véhicules.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <LayoutGrid size={120} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <LayoutGrid className="text-emerald-400" /> 
                  Catalogue Client
                </h2>
                <p className="text-emerald-100/70 max-w-md">
                  Explorez notre flotte actuelle et réservez le véhicule qui correspond à vos besoins.
                </p>
              </div>
            </motion.div>
          )}
        </section>

        {/* Rendu conditionnel strict du contenu principal */}
        <section className="pb-12">
          {isAdmin ? <AdminDashboard /> : <VehicleCatalog />}
        </section>
      </main>
    </div>
  );
};

export default Home;