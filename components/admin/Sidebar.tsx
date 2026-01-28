import React from 'react';
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    LogOut,
    Users,
    Globe,
    Sparkles,
    Lock,
    Settings,
    ExternalLink
} from 'lucide-react';
import { User } from '../../types';

export type AdminTab = 'overview' | 'articles' | 'content' | 'pages' | 'users' | 'settings' | 'ai-assistant' | 'media';

interface SidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    isAdmin: boolean;
    user: User | null;
    setShowPasswordForm: (show: boolean) => void;
    handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    isAdmin,
    user,
    setShowPasswordForm,
    handleLogout
}) => {
    return (
        <div className="w-64 border-r border-slate-800 flex flex-shrink-0 flex-col bg-slate-900">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold italic text-blue-400">FMA Portal CMS</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <button
                    onClick={() => window.location.href = '/'}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors mb-4 border border-slate-800/50"
                >
                    <ExternalLink className="mr-3 text-blue-400" size={20} /> <span className="font-bold">Voir le site</span>
                </button>
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <LayoutDashboard className="mr-3" size={20} /> Vue d'ensemble
                </button>
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'articles' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <FileText className="mr-3" size={20} /> Articles
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'media' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <ImageIcon className="mr-3" size={20} /> Médias
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <LayoutDashboard className="mr-3" size={20} /> Contenus
                </button>
                <button
                    onClick={() => setActiveTab('pages')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'pages' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <Globe className="mr-3" size={20} /> Pages
                </button>
                <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'ai-assistant' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <Sparkles className="mr-3" size={20} /> Assistant AI
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                >
                    <Settings className="mr-3" size={20} /> Paramètres
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <Users className="mr-3" size={20} /> Utilisateurs
                    </button>
                )}
            </nav>
            <div className="p-4 border-t border-slate-800 space-y-2">
                <div className="px-4 py-2 text-xs text-slate-500">
                    {user?.email}
                    <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px]">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors text-sm"
                >
                    <Lock className="mr-3" size={16} /> Changer mot de passe
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="mr-3" size={20} /> Déconnexion
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
