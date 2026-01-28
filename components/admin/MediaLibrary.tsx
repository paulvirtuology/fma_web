import React, { useState, useEffect } from 'react';
import {
    Trash2,
    Plus,
    Loader2,
    Copy,
    Check,
    Search,
    Grid,
    List as ListIcon,
    X,
    Image as ImageIcon
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';

interface MediaFile {
    name: string;
    id: string;
    created_at: string;
    url: string;
    metadata?: any;
}

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    isModal?: boolean;
    onClose?: () => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, isModal, onClose }) => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setIsLoading(true);
        try {
            const data = await mediaService.listFiles();
            setFiles(data as any);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setIsUploading(true);
        try {
            await mediaService.uploadOptimized(e.target.files[0]);
            await loadFiles();
        } catch (err) {
            alert("Erreur lors de l'upload");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (name: string) => {
        if (!confirm("Supprimer définitivement cette image ?")) return;
        try {
            await mediaService.deleteFile(name);
            await loadFiles();
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={`flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden ${isModal ? 'shadow-2xl' : ''}`}>
            {/* Header */}
            <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">Médiathèque</h2>
                    {isModal && (
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un fichier..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center cursor-pointer transition-all active:scale-95 whitespace-nowrap">
                        {isUploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Plus className="mr-2" size={16} />}
                        Uploader
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
                    </label>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <p className="font-medium animate-pulse">Chargement de vos fichiers...</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                            <ImageIcon size={40} className="text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400">Aucun fichier trouvé</h3>
                        <p className="max-w-xs text-sm">Commencez par uploader des photos ou ajustez votre recherche.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredFiles.map((file) => (
                            <div key={file.id} className="group bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/5">
                                {/* Thumbnail */}
                                <div className="aspect-square relative overflow-hidden bg-slate-900">
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {onSelect ? (
                                            <button
                                                onClick={() => onSelect(file.url)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg"
                                            >
                                                Sélectionner
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => copyToClipboard(file.url, file.id)}
                                                    className="bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-xl shadow-lg transition-transform active:scale-90"
                                                    title="Copier le lien"
                                                >
                                                    {copiedId === file.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.name)}
                                                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2.5 rounded-xl shadow-lg transition-transform active:scale-90"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <p className="text-xs font-bold text-slate-300 truncate mb-1" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                        {new Date(file.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Status Bar */}
            <div className="bg-slate-800/50 px-6 py-3 border-t border-slate-700 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>{filteredFiles.length} Fichiers</span>
                <span className="flex items-center gap-1">
                    <Check size={12} className="text-green-500" /> Stockage Optimisé
                </span>
            </div>
        </div>
    );
};

export default MediaLibrary;
