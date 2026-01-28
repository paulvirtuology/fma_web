import React from 'react';
import { Sparkles, Loader2, Globe, Check } from 'lucide-react';

interface AIAssistantTabProps {
    aiTopic: string;
    setAiTopic: (topic: string) => void;
    isGenerating: boolean;
    handleGenerate: () => void;
    generatedContent: string;
    setGeneratedContent: (content: string) => void;
    isTranslating: boolean;
    handleTranslate: () => void;
    onUseContent: (content: string) => void;
}

const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
    aiTopic,
    setAiTopic,
    isGenerating,
    handleGenerate,
    generatedContent,
    setGeneratedContent,
    isTranslating,
    handleTranslate,
    onUseContent
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                    <Sparkles className="text-blue-400 mr-3" size={24} />
                    <h1 className="text-2xl font-bold">Assistant de Rédaction Intelligent</h1>
                </div>
                <p className="text-slate-400 mb-6">
                    Utilisez l'intelligence artificielle pour générer des brouillons d'articles ou traduire vos textes en Malagasy.
                </p>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-300">Sujet de l'article</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            placeholder="Ex: Une journée porte ouverte à l'école de Betafo..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !aiTopic}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center"
                        >
                            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                            Générer
                        </button>
                    </div>
                </div>
            </div>

            {generatedContent && (
                <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Contenu Généré</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center text-white"
                            >
                                {isTranslating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Globe className="mr-2" size={16} />}
                                Traduire en Malagasy
                            </button>
                            <button
                                onClick={() => onUseContent(generatedContent)}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center text-white"
                            >
                                <Check className="mr-2" size={16} /> Utiliser ce texte
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="w-full h-96 bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-serif text-lg"
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default AIAssistantTab;
