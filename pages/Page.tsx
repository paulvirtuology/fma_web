import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Page, ContentBlock } from '../types';

interface PageProps {
  slug: string;
}

const PageComponent: React.FC<PageProps> = ({ slug }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const [pageData, pageBlocks] = await Promise.all([
          dataService.getPage(slug),
          dataService.getContentBlocks(slug)
        ]);
        setPage(pageData);
        setBlocks(pageBlocks.sort((a, b) => a.order_index - b.order_index));
      } catch (err) {
        console.error("Erreur chargement page", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4 max-w-lg px-4">
          <h1 className="text-4xl font-bold text-blue-900 italic">Page non trouvée</h1>
          <p className="text-slate-600">Cette page n'existe pas ou n'est pas encore publiée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-blue-900 italic mb-8">{page.title}</h1>
        
        {blocks.length > 0 && (
          <div className="space-y-12 mb-12">
            {blocks.map((block) => (
              <div key={block.id} className="space-y-4">
                {block.title && (
                  <h2 className="text-3xl font-bold text-blue-900">{block.title}</h2>
                )}
                {block.image && (
                  <img src={block.image} alt={block.title || ''} className="w-full rounded-2xl" />
                )}
                {block.content && (
                  <div 
                    className="text-slate-700 leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {page.content && (
          <div 
            className="text-slate-700 leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </div>
    </div>
  );
};

export default PageComponent;

