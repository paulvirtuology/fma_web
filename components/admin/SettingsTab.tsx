import React from 'react';
import { Save, Loader2, Download, ShieldCheck } from 'lucide-react';
import { SiteSetting } from '../../types';
import { backupService } from '../../services/backupService';

interface SettingsTabProps {
    settings: SiteSetting[];
    loadData: () => void;
    upsertSiteSetting: (setting: { key: string; value: string; type?: string }) => Promise<any>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
    settings,
    loadData,
    upsertSiteSetting
}) => {
    const settingFields = [
        { key: 'footer_brand_title', label: 'Titre Footer', default: 'FMA Madagascar' },
        { key: 'footer_brand_description', label: 'Description Footer', default: 'Description...' },
        { key: 'contact_address', label: 'Adresse', default: '' },
        { key: 'contact_phone', label: 'Téléphone', default: '' },
        { key: 'contact_email', label: 'Email', default: '' },
        { key: 'social_facebook', label: 'Facebook URL', default: '' },
        { key: 'social_twitter', label: 'Twitter URL', default: '' },
        { key: 'social_instagram', label: 'Instagram URL', default: '' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold italic">Paramètres du Site</h1>

            {/* Backup Section */}
            <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <ShieldCheck className="text-blue-400" size={20} />
                        Sauvegarde & Sécurité
                    </h3>
                    <p className="text-sm text-slate-400">Exportez tout le contenu de votre site (articles, pages, photos) vers un fichier sécurisé.</p>
                </div>
                <button
                    onClick={() => backupService.downloadCompleteBackup()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center shadow-lg transition-all active:scale-95"
                >
                    <Download className="mr-2" size={16} /> Exporter JSON
                </button>
            </div>

            <div className="space-y-4">
                {settingFields.map((field) => {
                    const current = settings.find(s => s.key === field.key);
                    return (
                        <div key={field.key} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <label className="block text-sm font-bold mb-2">{field.label}</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                value={current?.value || field.default}
                                onChange={e => upsertSiteSetting({ key: field.key, value: e.target.value }).then(() => loadData())}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SettingsTab;
