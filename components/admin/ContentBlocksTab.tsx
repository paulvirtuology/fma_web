import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { ContentBlock } from '../../types';
import TiptapEditor from './TiptapEditor';

interface ContentBlocksTabProps {
    contentBlocks: ContentBlock[];
    handleCreateBlock: () => void;
    updateContentBlock: (id: string, updates: Partial<ContentBlock>) => void;
    deleteContentBlock: (id: string) => void;
    moveBlock: (id: string, direction: 'up' | 'down') => void;
}

const ContentBlocksTab: React.FC<ContentBlocksTabProps> = ({
    contentBlocks,
    handleCreateBlock,
    updateContentBlock,
    deleteContentBlock,
    moveBlock
}) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold italic">Blocs de Contenu</h1>
                <button
                    onClick={handleCreateBlock}
                    className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                >
                    <Plus size={16} className="mr-2" /> Nouveau
                </button>
            </div>
            <div className="space-y-4">
                {contentBlocks.map((block) => (
                    <div key={block.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                        <div
                            className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-700/30 transition-colors"
                            onClick={() => toggleExpand(block.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-slate-500">
                                    {expandedId === block.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{block.key}</h3>
                                    <p className="text-sm text-slate-400">{block.page} / {block.section}</p>
                                </div>
                            </div>
                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => moveBlock(block.id, 'up')}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
                                    title="Monter"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    onClick={() => moveBlock(block.id, 'down')}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
                                    title="Descendre"
                                >
                                    <ArrowDown size={16} />
                                </button>
                                <button onClick={() => deleteContentBlock(block.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {expandedId === block.id && (
                            <div className="p-6 pt-0 border-t border-slate-700 animate-in slide-in-from-top-2 duration-200">
                                <div className="pt-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Titre du bloc</label>
                                        <input
                                            type="text"
                                            placeholder="Titre"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={block.title || ''}
                                            onChange={e => updateContentBlock(block.id, { title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Contenu</label>
                                        <TiptapEditor
                                            value={block.content || ''}
                                            onChange={val => updateContentBlock(block.id, { content: val })}
                                            placeholder="Contenu du bloc..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">URL de l'image (optionnel)</label>
                                        <input
                                            type="text"
                                            placeholder="URL Image"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={block.image || ''}
                                            onChange={e => updateContentBlock(block.id, { image: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {contentBlocks.length === 0 && (
                    <div className="p-12 text-center text-slate-500">Aucun bloc de contenu configuré.</div>
                )}
            </div>
        </div>
    );
};

export default ContentBlocksTab;
