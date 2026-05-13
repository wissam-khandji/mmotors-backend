import React from 'react';
import { Car, Fuel, Gauge, Zap } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Composant Catalogue pour les clients
 */
const VehicleCatalog: React.FC = () => {
  const vehicles = [
    { id: 1, name: 'Peugeot 208', type: 'Citadine', price: '45€', fuel: 'Essence', power: '100 ch', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Tesla Model Y', type: 'SUV', price: '95€', fuel: 'Électrique', power: '299 ch', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Renault Clio 5', type: 'Citadine', price: '40€', fuel: 'Hybride', power: '140 ch', image: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'BMW Série 3', type: 'Berline', price: '120€', fuel: 'Diesel', power: '190 ch', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Catalogue M-Motors</h2>
        <p className="text-slate-500">Choisissez votre véhicule idéal pour votre prochain trajet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle, idx) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={vehicle.image} 
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-slate-900 font-bold text-sm shadow-sm">
                {vehicle.price}/j
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-slate-500">{vehicle.type}</p>
                </div>
                {vehicle.fuel === 'Électrique' && <Zap size={18} className="text-amber-500" />}
              </div>

              <div className="flex items-center justify-between text-slate-500 text-sm mb-6">
                <div className="flex items-center gap-1.5">
                  <Fuel size={16} />
                  <span>{vehicle.fuel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gauge size={16} />
                  <span>{vehicle.power}</span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-slate-900 group-hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Car size={18} />
                Réserver
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VehicleCatalog;
