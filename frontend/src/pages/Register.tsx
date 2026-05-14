import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { Car, Lock, Mail, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      nom: '',
      email: '',
      motDePasse: '',
      confirmPassword: ''
    }
  });

  const motDePasse = watch('motDePasse');

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      // On s'assure d'envoyer uniquement les champs requis dans l'objet final
      const payload = {
        nom: data.nom,
        email: data.email,
        motDePasse: data.motDePasse,
        role: 'CLIENT'
      };
      
      await api.post('/auth/register', payload);
      
      setSuccess(true);
      // Redirection après 2.5 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      console.error('Registration Error:', err);
      // Récupération du message d'erreur dynamique du backend ou de l'état HTTP
      const serverMessage = err.response?.data?.message;
      const statusInfo = err.response 
        ? `Erreur ${err.response.status} : ${err.response.statusText || 'Action refusée par le serveur'}` 
        : (err.message || 'Le serveur est injoignable');
      
      setError(serverMessage || statusInfo);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="p-8">
          {/* Header avec Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <Car className="text-white w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">M-Motors</h1>
            <p className="text-slate-500 text-sm">Créez votre compte client</p>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center underline decoration-blue-500 decoration-4 underline-offset-8">Inscription</h2>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-emerald-900 font-bold">Compte créé avec succès !</h3>
                <p className="text-emerald-600 text-sm">Vous allez être redirigé vers la page de connexion...</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-4"
              >
                {/* Message d'erreur */}
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 text-sm mb-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1" htmlFor="nom">
                    Nom Complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="nom"
                      type="text"
                      {...register('nom', { required: 'Le nom est obligatoire' })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  {errors.nom && <p className="text-rose-500 text-[10px] mt-1 font-bold uppercase ml-1">{errors.nom.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1" htmlFor="email">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'L\'email est obligatoire',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="votre@email.fr"
                    />
                  </div>
                  {errors.email && <p className="text-rose-500 text-[10px] mt-1 font-bold uppercase ml-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1" htmlFor="motDePasse">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="motDePasse"
                      type="password"
                      {...register('motDePasse', { 
                        required: 'Le mot de passe est obligatoire',
                        minLength: { value: 6, message: 'Minimum 6 caractères' }
                      })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.motDePasse && <p className="text-rose-500 text-[10px] mt-1 font-bold uppercase ml-1">{errors.motDePasse.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1" htmlFor="confirmPassword">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', { 
                        required: 'Veuillez confirmer votre mot de passe',
                        validate: value => value === motDePasse || 'Les mots de passe ne correspondent pas'
                      })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-rose-500 text-[10px] mt-1 font-bold uppercase ml-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-400 text-white font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4 uppercase text-[10px] tracking-widest"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Déjà un compte ? <Link to="/login" className="text-blue-600 font-bold hover:underline">Connectez-vous</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
