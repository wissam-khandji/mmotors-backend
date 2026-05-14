import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Vehicle } from '../types/auth';
import { Car, Fuel, Gauge, Zap, Loader2, Calendar, Banknote, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Composant Catalogue pour les clients - Données réelles API
 */
const VehicleCatalog: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        // Appel GET vers http://localhost:8080/api/vehicles
        const response = await api.get<Vehicle[]>('/vehicles');
        setVehicles(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des véhicules:', err);
        setError('Impossible de charger le catalogue. Vérifiez que le serveur Spring Boot est lancé.');
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
        <p className="text-slate-500 animate-pulse">Chargement des véhicules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-700">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Catalogue M-Motors</h2>
        <p className="text-slate-500">Trouvez le véhicule idéal pour votre prochain trajet parmi notre flotte sélectionnée.</p>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">Aucun véhicule disponible</h3>
          <p className="text-slate-500">Revenez plus tard pour découvrir nos nouvelles offres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle, idx) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all flex flex-col"
            >
              {/* Image avec prix en évidence */}
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                <img 
                  src={vehicle.image || `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400`} 
                  alt={`${vehicle.marque} ${vehicle.modele}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-xl text-blue-700 font-bold text-sm shadow-lg flex items-center gap-1.5">
                  <Banknote size={14} />
                  {vehicle.prixJournalier}€/j
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">
                    {vehicle.marque} <span className="text-blue-600 font-extrabold">{vehicle.modele}</span>
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={14} />
                      <span>Année : {vehicle.annee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Gauge size={14} />
                      <span>{vehicle.kilometrage?.toLocaleString() || '0'} km</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <Fuel size={16} className="text-slate-400" />
                    <span className="text-xs font-medium">{vehicle.carburant || 'Hybride'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-xs font-medium">BVA</span>
                  </div>
                </div>

                <button className="w-full mt-auto py-3 bg-slate-900 group-hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                  <Car size={18} />
                  Réserver en ligne
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
