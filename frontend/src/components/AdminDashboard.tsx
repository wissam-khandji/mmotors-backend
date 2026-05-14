import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Vehicle } from '../types/auth';
import { 
  PlusCircle, 
  BarChart3, 
  Users, 
  CarFront, 
  Loader2, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  AlertCircle, 
  Key, 
  ShoppingBag,
  Banknote,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';

/**
 * Interface pour les données du formulaire de création de véhicule matching types/auth.ts
 */
interface VehicleFormInput {
  marque: string;
  modele: string;
  prix: number;
  annee: number;
  kilometrage: number;
  categorie: 'LOCATION' | 'VENTE';
  imagePath: string;
  statut: 'DISPONIBLE' | 'LOUE' | 'VENDU';
}

/**
 * Composant Dashboard pour les administrateurs avec tableau des véhicules
 */
const AdminDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<VehicleFormInput>({
    defaultValues: {
      categorie: 'LOCATION',
      statut: 'DISPONIBLE',
      annee: new Date().getFullYear()
    }
  });

  const selectedCategory = watch('categorie');
  const watchedImagePath = watch('imagePath');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('imagePath', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get<Vehicle[]>('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error('Erreur dashboard admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      reset({
        marque: vehicle.marque,
        modele: vehicle.modele,
        prix: vehicle.prix,
        annee: vehicle.annee,
        kilometrage: vehicle.kilometrage,
        categorie: vehicle.categorie,
        imagePath: vehicle.imagePath || '',
        statut: vehicle.statut || 'DISPONIBLE'
      });
    } else {
      setEditingVehicle(null);
      reset({
        marque: '',
        modele: '',
        prix: 0,
        annee: new Date().getFullYear(),
        kilometrage: 0,
        categorie: 'LOCATION',
        imagePath: '',
        statut: 'DISPONIBLE'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setError(null);
  };

  const handleDeleteVehicle = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;

    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression du véhicule.');
    }
  };

  const onSubmit = async (data: VehicleFormInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = {
        ...data,
        annee: Number(data.annee),
        prix: Number(data.prix),
        kilometrage: Number(data.kilometrage)
      };

      if (editingVehicle?.id) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }

      await fetchVehicles();
      handleCloseModal();
    } catch (err) {
      console.error('Erreur lors de l’enregistrement:', err);
      setError('Une erreur est survenue lors de l\'enregistrement du véhicule. Vérifiez la connexion au backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculs dynamiques pour les KPIs
  const totalVehicles = vehicles.length;
  const rentedVehicles = vehicles.filter(v => v.statut === 'LOUE').length;
  const usageRate = totalVehicles > 0 ? Math.round((rentedVehicles / totalVehicles) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion du Parc Automobile</h2>
          <p className="text-slate-500">Contrôlez l'inventaire, les statuts et les tarifs en temps réel</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 text-sm"
        >
          <PlusCircle size={20} />
          Ajouter un véhicule
        </button>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard 
          icon={<CarFront className="text-blue-600" />} 
          label="Véhicules Actifs" 
          value={totalVehicles.toString()} 
          trend="Inventaire" 
        />
        <AdminStatCard 
          icon={<BarChart3 className="text-emerald-600" />} 
          label="Taux d'utilisation" 
          value={`${usageRate}%`} 
          description={`${rentedVehicles} en location`}
        />
        <AdminStatCard 
          icon={<Users className="text-amber-600" />} 
          label="Conducteurs" 
          value="24" 
          description="Mode Simulé"
        />
      </div>

      {/* Liste des véhicules */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-widest text-xs">Répertoire Flotte</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"> Filtres rapides :</div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 uppercase tracking-tighter">
                 Location
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100 uppercase tracking-tighter">
                 Vente
              </span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-medium text-sm">Synchronisation des données...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                  <th className="px-6 py-5 font-black">Aperçu</th>
                  <th className="px-6 py-5 font-black">Véhicule</th>
                  <th className="px-6 py-5 font-black">Catégorie</th>
                  <th className="px-6 py-5 font-black text-center">Statut</th>
                  <th className="px-6 py-5 font-black">Prix</th>
                  <th className="px-6 py-5 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v, idx) => (
                  <motion.tr 
                    key={v.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-14 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
                        {v.imagePath ? (
                          <img src={v.imagePath} alt={v.marque} className="w-full h-full object-cover" />
                        ) : (
                          <CarFront size={16} className="text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{v.marque} {v.modele}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {v.annee ? v.annee : 'N/A'} • {v.kilometrage?.toLocaleString() || '0'} KM
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {v.categorie === 'LOCATION' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                          <Key size={10} /> Location
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                          <ShoppingBag size={10} /> Vente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <StatusBadge status={v.statut} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">
                        {v.prix.toLocaleString()}€
                        {v.categorie === 'LOCATION' && <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/mois</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(v)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 grayscale opacity-40">
                         <CarFront size={40} className="text-slate-300" />
                         <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Le parc est vide</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Modal de Configuration */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    {editingVehicle ? 'Mise à jour Fiche' : 'Nouveau au Parc'}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">ID interne : {editingVehicle?.id || 'AUTO-GÉNÉRÉ'}</p>
                </div>
                <button onClick={handleCloseModal} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full shadow-sm border border-transparent hover:border-slate-100 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-sm font-bold">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                  </div>
                )}

                {/* Switch Catégorie */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Offre Commerciale</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`
                      flex items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all
                      ${selectedCategory === 'LOCATION' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xl shadow-emerald-50' 
                        : 'border-slate-100 text-slate-400 hover:bg-slate-50'}
                    `}>
                      <input type="radio" value="LOCATION" {...register('categorie')} className="hidden" />
                      <Key size={20} />
                      <span className="font-black uppercase tracking-tighter">Location (LLD)</span>
                    </label>
                    <label className={`
                      flex items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all
                      ${selectedCategory === 'VENTE' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-xl shadow-blue-50' 
                        : 'border-slate-100 text-slate-400 hover:bg-slate-50'}
                    `}>
                      <input type="radio" value="VENTE" {...register('categorie')} className="hidden" />
                      <ShoppingBag size={20} />
                      <span className="font-black uppercase tracking-tighter">Vente Directe</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Stats Techniques */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identité Véhicule</label>
                       <div className="grid grid-cols-2 gap-2">
                          <input {...register('marque', { required: true })} placeholder="Marque" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold" />
                          <input {...register('modele', { required: true })} placeholder="Modèle" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Année & Usage</label>
                       <div className="grid grid-cols-2 gap-2">
                          <input type="number" {...register('annee', { required: true })} placeholder="Année" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold" />
                          <input type="number" {...register('kilometrage', { required: true })} placeholder="KM" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold" />
                       </div>
                    </div>
                  </div>

                  {/* Pricing & Media */}
                  <div className="space-y-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedCategory === 'LOCATION' ? 'Loyer (€/mois)' : 'Prix (€)'}</label>
                       <div className="relative">
                          <input type="number" {...register('prix', { required: true, min: 1 })} placeholder="Montant" className="w-full pl-14 pr-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-black text-xl" />
                          <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visuel du Véhicule</label>
                       <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300 shadow-inner flex-shrink-0">
                          {watchedImagePath ? (
                            <img src={watchedImagePath} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <ImageIcon className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-[10px] text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-[9px] file:font-black file:bg-slate-900 file:text-white hover:file:bg-blue-600 transition-all cursor-pointer uppercase tracking-widest"
                          />
                          <input type="hidden" {...register('imagePath')} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statut opérationnel */}
                <div className="space-y-2 pt-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut du Stock</label>
                   <select {...register('statut')} className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold bg-slate-50 appearance-none cursor-pointer">
                      <option value="DISPONIBLE">🟢 Disponible - Prêt pour départ</option>
                      <option value="LOUE">🟠 Loué - Actuellement sur route</option>
                      <option value="VENDU">🔴 Vendu - Sortie de stock</option>
                   </select>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-4 border-2 border-slate-100 text-slate-400 font-black rounded-[1.5rem] hover:bg-slate-50 hover:text-slate-600 transition-all uppercase tracking-[0.2em] text-[10px]">
                    Abandonner
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-[1.5rem] hover:shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {editingVehicle ? 'Valider les modifications' : 'Inscrire au catalogue'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- Composants Utilitaires Internes --- */

const AdminStatCard = ({ icon, label, value, trend, description }: { icon: React.ReactNode, label: string, value: string, trend?: string, description?: string }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
      {trend ? (
        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 uppercase tracking-widest">
          {trend}
        </span>
      ) : (
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{description}</p>
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  switch (status) {
    case 'DISPONIBLE':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
          <CheckCircle2 size={12} /> Dispo
        </span>
      );
    case 'LOUE':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">
          <Clock size={12} /> Loué
        </span>
      );
    case 'VENDU':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-widest">
          <Ban size={12} /> Vendu
        </span>
      );
    default:
      return null;
  }
};

export default AdminDashboard;
