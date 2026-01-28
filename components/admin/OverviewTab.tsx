import React from 'react';
import { FileText, Users, Globe, TrendingUp, Sparkles, Image, ShieldCheck, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../../types';
import { AdminTab } from './Sidebar';

interface OverviewTabProps {
    articles: NewsArticle[];
    setActiveTab: (tab: AdminTab) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ articles, setActiveTab }) => {
    const stats = [
        { label: 'Articles Publiés', value: articles.length, change: '+2', icon: <FileText /> },
        { label: 'Visites ce mois', value: '1.2k', change: '+15%', icon: <TrendingUp /> },
        { label: 'Images Optimisées', value: '45', change: '100%', icon: <Image /> },
        { label: 'Temps de chargement', value: '0.8s', change: 'Fast', icon: <TrendingUp /> },
    ];

    const quickActions = [
        {
            title: 'Modifier la Page d\'Accueil',
            desc: 'Éditez le texte, les images et l\'ordre des sections.',
            icon: <Globe className="text-blue-400" />,
            tab: 'content' as AdminTab
        },
        {
            title: 'Gérer la Médiathèque',
            desc: 'Uploadez et optimisez vos nouvelles photos.',
            icon: <Image className="text-purple-400" />,
            tab: 'media' as AdminTab
        },
        {
            title: 'Rédiger une Actualité',
            desc: 'Partagez les derniers événements FMA.',
            icon: <FileText className="text-green-400" />,
            tab: 'articles' as AdminTab
        },
        {
            title: 'Assistant AI',
            desc: 'Générez du contenu ou traduisez en Malagasy.',
            icon: <Sparkles className="text-amber-400" />,
            tab: 'ai-assistant' as AdminTab
        }
    ];

    return (
        <div className="space-y-10 max-w-7xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-serif">Tableau de Bord</h1>
                    <p className="text-slate-400 mt-2">Bienvenue dans votre centre de contrôle FMA Madagascar.</p>
                </div>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Système en ligne
                    </div>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="group bg-slate-800/50 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-900 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">{stat.icon}</div>
                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-blue-400" size={20} />
                        Actions Rapides
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(action.tab)}
                                className="flex items-start gap-4 p-6 bg-slate-800 border border-slate-700 rounded-3xl hover:bg-slate-700/50 hover:border-blue-500/50 transition-all text-left group"
                            >
                                <div className="p-3 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
                                    {action.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{action.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{action.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Site Status */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="text-green-400" size={20} />
                        État du Site
                    </h2>
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Optimisation Image</span>
                            <span className="text-green-400 font-bold">Actif</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Dernière Sauvegarde</span>
                            <span className="text-slate-200">Aujourd'hui</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Version CMS</span>
                            <span className="text-slate-200">2.1.0-Gold</span>
                        </div>
                        <div className="h-px bg-slate-700 my-4" />
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center justify-center gap-2 transition-all"
                        >
                            Voir tous les paramètres
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
