import React from 'react';
import { PlusCircle, BarChart3, Users, CarFront } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Composant Dashboard pour les administrateurs
 */
const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion du Parc</h2>
          <p className="text-slate-500">Supervisez l'ensemble de la flotte M-Motors</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
          <PlusCircle size={20} />
          Ajouter une voiture
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard icon={<CarFront />} label="Véhicules Actifs" value="124" trend="+12%" />
        <AdminStatCard icon={<BarChart3 />} label="Taux d'utilisation" value="88%" trend="+5%" />
        <AdminStatCard icon={<Users />} label="Conducteurs" value="98" trend="Stable" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Alertes Maintenance</h3>
          <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">4 Urgences</span>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <CarFront size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Tesla Model 3 - AA-888-ZZ</p>
                  <p className="text-sm text-slate-500">Révision des 30,000 km dépassée</p>
                </div>
              </div>
              <button className="text-blue-600 font-medium text-sm hover:underline">Planifier</button>
            </div>
          ))}
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
