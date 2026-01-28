
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Calendar, User } from 'lucide-react';
import { dataService } from '../services/dataService';
import { NewsArticle } from '../types';

interface ArticleDetailProps {
    id: string;
    onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ id, onBack }) => {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await dataService.getArticle(id);
                setArticle(data);
            } catch (err) {
                console.error("Erreur chargement article", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (isLoading) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4 max-w-lg px-4">
                    <h1 className="text-4xl font-bold text-blue-900 italic">Article non trouvé</h1>
                    <p className="text-slate-600">Cet article n'existe pas ou a été supprimé.</p>
                    <button
                        onClick={onBack}
                        className="text-blue-600 font-bold flex items-center justify-center mx-auto hover:-translate-x-1 transition-transform"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Retour aux actualités
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={onBack}
                    className="mb-8 text-slate-500 hover:text-blue-600 font-medium flex items-center transition-colors group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Retour
                </button>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full">
                            {article.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight italic">
                            {article.title}
                        </h1>
                        <div className="flex items-center space-x-6 text-slate-400 text-sm font-medium border-y border-slate-100 py-4">
                            <div className="flex items-center">
                                <Calendar size={16} className="mr-2" />
                                {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center">
                                <User size={16} className="mr-2" />
                                Admin FMA
                            </div>
                        </div>
                    </div>

                    {article.image && (
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg prose-slate max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
