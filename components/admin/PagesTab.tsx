import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Page } from '../../types';
import TiptapEditor from './TiptapEditor';

interface PagesTabProps {
    pages: Page[];
    handleCreatePage: () => void;
    updatePage: (id: string, updates: Partial<Page>) => void;
    deletePage: (id: string) => void;
}

const PagesTab: React.FC<PagesTabProps> = ({
    pages,
    handleCreatePage,
    updatePage,
    deletePage
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold italic">Pages</h1>
                    <p className="text-xs text-slate-500 mt-1">Utilisez ces slugs pour vos liens de menu: <span className="text-blue-400">about</span>, <span className="text-blue-400">missions</span>, <span className="text-blue-400">news</span>, <span className="text-blue-400">contact</span>.</p>
                </div>
                <button
                    onClick={handleCreatePage}
                    className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                >
                    <Plus size={16} className="mr-2" /> Nouveau
                </button>
            </div>
            <div className="space-y-4">
                {pages.map((page) => (
                    <div key={page.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold">{page.title}</h3>
                                <p className="text-sm text-slate-400">/{page.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={page.is_published}
                                        onChange={e => updatePage(page.id, { is_published: e.target.checked })}
                                    />
                                    <span className="text-sm">Publié</span>
                                </label>
                                <button onClick={() => deletePage(page.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <TiptapEditor
                            value={page.content || ''}
                            onChange={val => updatePage(page.id, { content: val })}
                            placeholder="Contenu de la page..."
                        />
                    </div>
                ))}
                {pages.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Aucune page personnalisée.</div>
                )}
            </div>
        </div>
    );
};

export default PagesTab;
