import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Car, User, FileText } from 'lucide-react';

/**
 * Composant de navigation principal pour M-Motors
 */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Section Gauche : Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-blue-100">
              <Car className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">M-Motors</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center">
            {user && (user.role === 'CLIENT' || user.role === 'USER') && (
              <Link 
                to="/mes-dossiers"
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
              >
                <FileText size={16} className="text-blue-500" />
                Mes Demandes
              </Link>
            )}
          </div>

          {/* Section Droite : Profil & Logout */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                <User size={16} />
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              <span className="hidden xs:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
