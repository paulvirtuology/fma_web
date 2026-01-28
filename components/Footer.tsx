
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">FMA Madagascar</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Dédiées à l'éducation et à l'évangélisation des jeunes, en particulier les plus pauvres, dans l'esprit de Don Bosco et de Marie Dominique Mazzarello.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-blue-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Liens Rapides</h4>
            <ul className="space-y-4 text-sm text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">Histoire des FMA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nos Communautés</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Projets Sociaux</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vocation & Formation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-blue-200">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-blue-400 flex-shrink-0" />
                <span>Maison Provinciale, Ivato, Antananarivo, Madagascar</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-blue-400 flex-shrink-0" />
                <span>+261 20 22 444 55</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-blue-400 flex-shrink-0" />
                <span>contact@fma-madagascar.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-blue-200 mb-4">Inscrivez-vous pour recevoir nos dernières nouvelles.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="bg-blue-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-16 pt-8 text-center text-sm text-blue-400">
          <p>© {new Date().getFullYear()} FMA Madagascar. Tous droits réservés. Réalisé pour la gloire de Marie Auxiliatrice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
