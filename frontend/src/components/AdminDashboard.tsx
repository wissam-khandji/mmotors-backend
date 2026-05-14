import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Vehicle } from '../types/auth';
import { PlusCircle, BarChart3, Users, CarFront, Loader2, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Composant Dashboard pour les administrateurs avec tableau des véhicules
 */
const AdminDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get<Vehicle[]>('/vehicles');
        setVehicles(response.data);
      } catch (err) {
        console.error('Erreur dashboard admin:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion du Parc</h2>
          <p className="text-slate-500">Supervisez l'ensemble de la flotte M-Motors</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
          <PlusCircle size={20} />
          Ajouter un véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard icon={<CarFront />} label="Véhicules Actifs" value={vehicles.length.toString()} trend="+2%" />
        <AdminStatCard icon={<BarChart3 />} label="Taux d'utilisation" value="84%" trend="+5%" />
        <AdminStatCard icon={<Users />} label="Conducteurs" value="12" trend="Stable" />
      </div>

      {/* Tableau des véhicules */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Liste des Véhicules</h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Véhicule</th>
                  <th className="px-6 py-4 font-semibold">Année</th>
                  <th className="px-6 py-4 font-semibold">Kilométrage</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                          {v.marque ? v.marque[0].toUpperCase() : <CarFront size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{v.marque} {v.modele}</p>
                          <p className="text-xs text-slate-500">{v.prixJournalier}€ / jour</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.annee}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                      {v.kilometrage?.toLocaleString() || '0'} km
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Aucun véhicule configuré dans le parc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const AdminStatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 text-slate-500 mb-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
        {trend}
      </span>
    </div>
  </div>
);

export default AdminDashboard;
