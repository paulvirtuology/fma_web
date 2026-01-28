import { Plus, X, Mail, FileText, Trash2, Save, Loader2, Edit3 } from 'lucide-react';
import { NewsArticle } from '../../types';
import TiptapEditor from './TiptapEditor';

interface ArticlesTabProps {
    articles: NewsArticle[];
    showNewForm: boolean;
    setShowNewForm: (show: boolean) => void;
    newArticle: {
        title: string;
        content: string;
        category: string;
        image: string;
        date: string;
    };
    setNewArticle: React.Dispatch<React.SetStateAction<any>>;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    saveArticle: () => void;
    deleteArticle: (id: string) => void;
    updateArticle: (id: string, updates: Partial<NewsArticle>) => void;
    editingArticle: NewsArticle | null;
    setEditingArticle: (article: NewsArticle | null) => void;
    isLoading: boolean;
}

const ArticlesTab: React.FC<ArticlesTabProps> = ({
    articles,
    showNewForm,
    setShowNewForm,
    newArticle,
    setNewArticle,
    handleFileUpload,
    saveArticle,
    deleteArticle,
    updateArticle,
    editingArticle,
    setEditingArticle,
    isLoading
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold italic">Gestion des Articles</h1>
                <button
                    onClick={() => {
                        setEditingArticle(null);
                        setShowNewForm(true);
                    }}
                    className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                >
                    <Plus size={16} className="mr-2" /> Nouveau
                </button>
            </div>

            {/* Create or Edit Form */}
            {(showNewForm || editingArticle) && (
                <div className="bg-slate-800 p-8 rounded-3xl border border-blue-500/30 space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold font-serif italic text-blue-400">
                            {editingArticle ? "Modifier l'article" : "Nouvel Article"}
                        </h2>
                        <button
                            onClick={() => {
                                setShowNewForm(false);
                                setEditingArticle(null);
                            }}
                            className="p-2 hover:bg-slate-700 rounded-full text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Titre</label>
                                <input
                                    type="text"
                                    placeholder="Titre de l'article"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={editingArticle ? editingArticle.title : newArticle.title}
                                    onChange={e => editingArticle
                                        ? setEditingArticle({ ...editingArticle, title: e.target.value })
                                        : setNewArticle((prev: any) => ({ ...prev, title: e.target.value }))
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Catégorie</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={editingArticle ? editingArticle.category : newArticle.category}
                                    onChange={e => editingArticle
                                        ? setEditingArticle({ ...editingArticle, category: e.target.value })
                                        : setNewArticle((prev: any) => ({ ...prev, category: e.target.value }))
                                    }
                                >
                                    <option>Événement</option>
                                    <option>Mission</option>
                                    <option>Spiritualité</option>
                                </select>
                            </div>
                        </div>
                        <div className="relative group rounded-3xl overflow-hidden bg-slate-900 border border-slate-700 border-dashed aspect-video flex items-center justify-center">
                            {(editingArticle?.image || newArticle.image) ? (
                                <>
                                    <img
                                        src={editingArticle ? editingArticle.image : newArticle.image}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        alt="preview"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/30">
                                            Changer l'image
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <label className="cursor-pointer text-center p-6 w-full h-full flex flex-col items-center justify-center hover:bg-slate-800 transition-colors">
                                    <Plus size={32} className="text-slate-600 mb-2" />
                                    <span className="text-sm font-bold text-slate-500">Ajouter une image de couverture</span>
                                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <TiptapEditor
                        value={editingArticle ? editingArticle.content : newArticle.content}
                        onChange={val => editingArticle
                            ? setEditingArticle({ ...editingArticle, content: val })
                            : setNewArticle((prev: any) => ({ ...prev, content: val }))
                        }
                        placeholder="Commencez à rédiger votre article..."
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => {
                                setShowNewForm(false);
                                setEditingArticle(null);
                            }}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={editingArticle ? () => {
                                updateArticle(editingArticle.id, editingArticle);
                                setEditingArticle(null);
                            } : saveArticle}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                            {editingArticle ? "Enregistrer les modifications" : "Publier l'article"}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-700">
                            <tr>
                                <th className="px-8 py-5">Article</th>
                                <th className="px-8 py-5">Catégorie</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {articles.map((art) => (
                                <tr key={art.id} className="hover:bg-slate-700/20 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            {art.image && (
                                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                                                    <img src={art.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            )}
                                            <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{art.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                                            {art.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{new Date(art.date).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingArticle(art)}
                                                className="p-2.5 bg-slate-700/50 hover:bg-blue-600 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg"
                                                title="Modifier"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteArticle(art.id)}
                                                className="p-2.5 bg-slate-700/50 hover:bg-red-600 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {articles.length === 0 && !isLoading && (
                                <tr><td colSpan={4} className="p-20 text-center text-slate-500 italic">Aucun article trouvé. Commencez par créer votre première actualité !</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ArticlesTab;
