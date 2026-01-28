
import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SiteSetting } from '../types';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await dataService.getSiteSettings();
        const settingsMap: Record<string, string> = {};
        allSettings.forEach(s => {
          settingsMap[s.key] = s.value;
        });
        setSettings(settingsMap);
      } catch (err) {
        console.error("Erreur chargement settings", err);
      }
    };
    loadSettings();
  }, []);

  const getSetting = (key: string, defaultValue: string) => settings[key] || defaultValue;

  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{getSetting('footer_brand_title', 'FMA Madagascar')}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              {getSetting('footer_brand_description', "Dédiées à l'éducation et à l'évangélisation des jeunes, en particulier les plus pauvres, dans l'esprit de Don Bosco et de Marie Dominique Mazzarello.")}
            </p>
            <div className="flex space-x-4 pt-2">
              {getSetting('social_facebook', '') && (
                <a href={getSetting('social_facebook', '#')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><Facebook size={20} /></a>
              )}
              {getSetting('social_twitter', '') && (
                <a href={getSetting('social_twitter', '#')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
              )}
              {getSetting('social_instagram', '') && (
                <a href={getSetting('social_instagram', '#')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><Instagram size={20} /></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{getSetting('footer_links_title', 'Liens Rapides')}</h4>
            <ul className="space-y-4 text-sm text-blue-200">
              {getSetting('footer_links', 'Histoire des FMA|#\nNos Communautés|#\nProjets Sociaux|#\nVocation & Formation|#').split('\n').map((link, i) => {
                const [text, url] = link.split('|');
                return (
                  <li key={i}><a href={url || '#'} className="hover:text-white transition-colors">{text}</a></li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">{getSetting('footer_contact_title', 'Contact')}</h4>
            <ul className="space-y-4 text-sm text-blue-200">
              {getSetting('contact_address', 'Maison Provinciale, Ivato, Antananarivo, Madagascar') && (
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-blue-400 flex-shrink-0" />
                  <span>{getSetting('contact_address', '')}</span>
                </li>
              )}
              {getSetting('contact_phone', '') && (
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 text-blue-400 flex-shrink-0" />
                  <span>{getSetting('contact_phone', '')}</span>
                </li>
              )}
              {getSetting('contact_email', '') && (
                <li className="flex items-center">
                  <Mail size={18} className="mr-3 text-blue-400 flex-shrink-0" />
                  <span>{getSetting('contact_email', '')}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          {getSetting('newsletter_enabled', 'true') === 'true' && (
            <div>
              <h4 className="text-lg font-bold mb-6">{getSetting('newsletter_title', 'Newsletter')}</h4>
              <p className="text-sm text-blue-200 mb-4">{getSetting('newsletter_description', "Inscrivez-vous pour recevoir nos dernières nouvelles.")}</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={getSetting('newsletter_placeholder', 'Votre email')}
                  className="bg-blue-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-colors">
                  {getSetting('newsletter_button', 'OK')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-blue-800 mt-16 pt-8 text-center text-sm text-blue-400">
          <p>{getSetting('footer_copyright', `© ${new Date().getFullYear()} FMA Madagascar. Tous droits réservés. Réalisé pour la gloire de Marie Auxiliatrice.`)}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
