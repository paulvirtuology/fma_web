
import React, { useEffect, useState } from 'react';
import { ArrowRight, Users, Star, Quote, Heart, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { NewsArticle, ContentBlock, View } from '../types';

interface HomeProps {
  onNavigate: (view: View) => void;
  onViewArticle: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onViewArticle }) => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [contentBlocks, setContentBlocks] = useState<Record<string, ContentBlock>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [news, blocks] = await Promise.all([
          dataService.getArticles(3),
          dataService.getContentBlocks('home')
        ]);
        setLatestNews(news);
        const blocksMap: Record<string, ContentBlock> = {};
        blocks.forEach(block => {
          blocksMap[block.key] = block;
        });
        setContentBlocks(blocksMap);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBlock = (key: string): ContentBlock => {
    return contentBlocks[key] || { id: '', key, page: 'home', section: 'main', title: '', content: '', image: '', metadata: {}, order_index: 0 };
  };

  const hero = getBlock('hero');
  const pillars = getBlock('pillars');
  const quote = getBlock('quote');
  const newsSection = getBlock('news_section');

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000"}
            alt="FMA Madagascar mission"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            {hero.metadata?.badge && (
              <span className="inline-block px-4 py-1 bg-blue-600 text-xs font-bold uppercase tracking-widest rounded-full">
                {hero.metadata.badge}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: hero.title || 'Pour les jeunes, <br /><span class="text-blue-400 italic">avec Marie</span>.' }}></h1>
            <div className="text-xl text-slate-200 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: hero.content || "Nous sommes une communauté religieuse dédiée à l'accompagnement et à l'éducation intégrale de la jeunesse malgache, inspirée par le charisme de Don Bosco." }}>
            </div>
            {hero.metadata?.buttons && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {hero.metadata.buttons.map((btn: any, i: number) => (
                  <button key={i} className={btn.primary ? "bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 flex items-center justify-center" : "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold transition-all"}>
                    {btn.text} {btn.icon && <ArrowRight size={20} className="ml-2" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-blue-900 italic">{pillars.title || "Nos Piliers Éducatifs"}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            {pillars.content && (
              <p className="text-slate-600">{pillars.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(pillars.metadata?.items || [
              { icon: 'star', title: "Raison", desc: "Favoriser le dialogue et la compréhension mutuelle entre l'éducateur et le jeune." },
              { icon: 'users', title: "Religion", desc: "Proposer une spiritualité joyeuse et concrète, basée sur l'amour de Dieu et du prochain." },
              { icon: 'heart', title: "Affection", desc: "Créer un climat de confiance où le jeune se sent aimé et valorisé." }
            ]).map((pillar: any, i: number) => {
              const icons: Record<string, React.ReactElement> = {
                star: <Star size={32} className="text-blue-600" />,
                users: <Users size={32} className="text-blue-600" />,
                heart: <Heart size={32} className="text-blue-600" />
              };
              return (
                <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow group">
                  <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {icons[pillar.icon] || icons.star}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-900 italic">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-blue-900 text-white relative overflow-hidden">
        <Quote size={200} className="absolute -bottom-10 -right-10 text-blue-800 opacity-20" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <p className="text-3xl md:text-4xl font-serif italic leading-relaxed">
            {quote.content || '"Fais en sorte que chaque jeune se sente aimé."'}
          </p>
          {quote.metadata?.author && (
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-[2px] bg-blue-500"></div>
              <span className="text-lg font-bold tracking-widest uppercase">{quote.metadata.author}</span>
              <div className="w-16 h-[2px] bg-blue-500"></div>
            </div>
          )}
        </div>
      </section>

      {/* News Preview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-blue-900 italic">{newsSection.title || "Dernières Actualités"}</h2>
              {newsSection.content && (
                <p className="text-slate-600 mt-2">{newsSection.content}</p>
              )}
            </div>
            {newsSection.metadata?.showViewAll !== false && (
              <button
                onClick={() => onNavigate('news')}
                className="text-blue-600 font-bold flex items-center hover:translate-x-1 transition-transform"
              >
                Tout voir <ArrowRight size={20} className="ml-2" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
            ) : (
              latestNews.map((news) => (
                <div key={news.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => onViewArticle(news.id)}
                  >
                    <img
                      src={news.image || "https://picsum.photos/600/400"}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{news.category}</span>
                    <h3
                      onClick={() => onViewArticle(news.id)}
                      className="text-xl font-bold mt-2 mb-3 leading-tight hover:text-blue-600 cursor-pointer"
                    >
                      {news.title}
                    </h3>
                    <div className="text-slate-600 text-sm line-clamp-3 mb-4 prose prose-slate" dangerouslySetInnerHTML={{ __html: news.content }}>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span>{new Date(news.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>Admin FMA</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            {!isLoading && latestNews.length === 0 && (
              <p className="col-span-3 text-center text-slate-400">Aucune actualité pour le moment.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
