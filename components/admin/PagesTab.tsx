import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
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
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };
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
                    <div key={page.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                        <div
                            className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-700/30 transition-colors"
                            onClick={() => toggleExpand(page.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-slate-500">
                                    {expandedId === page.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{page.title}</h3>
                                    <p className="text-sm text-slate-400">/{page.slug}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center" onClick={e => e.stopPropagation()}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                                        checked={page.is_published}
                                        onChange={e => updatePage(page.id, { is_published: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium">Publié</span>
                                </label>
                                <button
                                    onClick={() => deletePage(page.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {expandedId === page.id && (
                            <div className="p-6 pt-0 border-t border-slate-700 animate-in slide-in-from-top-2 duration-200">
                                <div className="pt-6">
                                    <TiptapEditor
                                        value={page.content || ''}
                                        onChange={val => updatePage(page.id, { content: val })}
                                        placeholder="Contenu de la page..."
                                    />
                                </div>
                            </div>
                        )}
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
