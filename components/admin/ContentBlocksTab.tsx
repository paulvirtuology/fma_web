import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import React from 'react';
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
                    <div key={block.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold">{block.key}</h3>
                                <p className="text-sm text-slate-400">{block.page} / {block.section}</p>
                            </div>
                            <div className="flex gap-2">
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
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Titre"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                value={block.title || ''}
                                onChange={e => updateContentBlock(block.id, { title: e.target.value })}
                            />
                            <TiptapEditor
                                value={block.content || ''}
                                onChange={val => updateContentBlock(block.id, { content: val })}
                                placeholder="Contenu du bloc..."
                            />
                            <input
                                type="text"
                                placeholder="URL Image"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                                value={block.image || ''}
                                onChange={e => updateContentBlock(block.id, { image: e.target.value })}
                            />
                        </div>
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
