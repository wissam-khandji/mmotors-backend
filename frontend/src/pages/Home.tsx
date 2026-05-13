import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AdminDashboard from '../components/AdminDashboard';
import VehicleCatalog from '../components/VehicleCatalog';
import type { User } from '../types/auth';
import { Shield, LayoutGrid, Info, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Page d'accueil avec Navbar et contenu dynamique selon le rôle
 */
const Home: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Sécurité si user est null ou en cours de chargement
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
  
  // Utilisation du Optional Chaining pour éviter les erreurs runtime
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isClient = user?.roles?.includes('ROLE_CLIENT');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de bienvenue */}
        <section className="mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-900">Bienvenue, {user?.email}</h1>
            <p className="text-slate-500 mt-1">Gérez vos activités M-Motors en toute simplicité.</p>
          </motion.div>
        </section>

        {/* Bannière de rôle */}
        <section className="mb-10">
          {isAdmin ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 flex items-center gap-4 border border-blue-500"
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Mode Administrateur - Gestion du parc</h2>
                <p className="text-blue-100 opacity-90">Accès complet à la gestion des véhicules, conducteurs et assurances.</p>
              </div>
            </motion.div>
          ) : isClient ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200 flex items-center gap-4 border border-emerald-500"
            >
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Catalogue M-Motors</h2>
                <p className="text-emerald-100 opacity-90">Consultez les offres disponibles et trouvez votre prochain véhicule.</p>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-200 rounded-2xl p-6 text-slate-700 flex items-center gap-4">
              <Info className="w-8 h-8 text-slate-500" />
              <div>
                <h2 className="text-xl font-bold">Session Active</h2>
                <p>Aucun rôle spécifique détecté. Veuillez contacter votre administrateur.</p>
              </div>
            </div>
          )}
        </section>

        {/* Contenu spécifique au rôle */}
        <section>
          {isAdmin && <AdminDashboard />}
          {isClient && <VehicleCatalog />}
          {!isAdmin && !isClient && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <p className="text-slate-500">Vous n'avez pas encore accès aux modules de l'application.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
