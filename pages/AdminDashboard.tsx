
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  TrendingUp, 
  Users, 
  Globe, 
  Sparkles,
  Loader2,
  Trash2,
  Check,
  Save,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateNewsDraft, translateToMalagasy } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { NewsArticle } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'ai-assistant'>('overview');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // AI State
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Form State for new article
  const [showNewForm, setShowNewForm] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: 'Événement',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getArticles();
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    const result = await generateNewsDraft(aiTopic);
    setGeneratedContent(result || '');
    setIsGenerating(false);
  };

  const handleTranslate = async () => {
    if (!generatedContent) return;
    setIsTranslating(true);
    const result = await translateToMalagasy(generatedContent);
    setGeneratedContent(prev => `${prev}\n\n--- VERSION MALAGASY ---\n\n${result}`);
    setIsTranslating(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setIsLoading(true);
      const url = await dataService.uploadImage(e.target.files[0]);
      setNewArticle(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert("Erreur lors de l'upload");
    } finally {
      setIsLoading(false);
    }
  };

  const saveArticle = async () => {
    try {
      setIsLoading(true);
      await dataService.createArticle(newArticle);
      setShowNewForm(false);
      setNewArticle({
        title: '',
        content: '',
        category: 'Événement',
        image: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadData();
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    try {
      await dataService.deleteArticle(id);
      loadData();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 flex flex-shrink-0 flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold italic text-blue-400">FMA Portal CMS</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard className="mr-3" size={20} /> Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('articles')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'articles' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <FileText className="mr-3" size={20} /> Articles & Pages
          </button>
          <button 
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'ai-assistant' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Sparkles className="mr-3" size={20} /> Assistant AI
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="mr-3" size={20} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Tableau de Bord</h1>
                <p className="text-slate-400">Contrôlez le contenu de FMA Madagascar.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Articles Total', value: articles.length, change: '+2', icon: <FileText /> },
                { label: 'Jeunes Impactés', value: '5.2k', change: '+12%', icon: <Users /> },
                { label: 'Communautés', value: '12', change: 'Stable', icon: <Globe /> },
                { label: 'Projets Actifs', value: '8', change: 'Stable', icon: <TrendingUp /> },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">{stat.icon}</div>
                    <span className="text-xs font-bold text-green-400">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold italic">Gestion des Articles</h1>
              <button 
                onClick={() => setShowNewForm(true)}
                className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
              >
                <Plus size={16} className="mr-2" /> Nouveau
              </button>
            </div>

            {showNewForm && (
              <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/30 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Nouvel Article</h2>
                  <button onClick={() => setShowNewForm(false)}><X size={20}/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Titre de l'article"
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3"
                    value={newArticle.title}
                    onChange={e => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <select 
                    className="bg-slate-900 border border-slate-700 rounded-lg p-3"
                    value={newArticle.category}
                    onChange={e => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option>Événement</option>
                    <option>Mission</option>
                    <option>Spiritualité</option>
                  </select>
                </div>
                <textarea 
                  placeholder="Contenu..."
                  rows={6}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3"
                  value={newArticle.content}
                  onChange={e => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                />
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer bg-slate-700 p-3 rounded-lg border border-dashed border-slate-500 text-center hover:bg-slate-600 transition-colors">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    {newArticle.image ? 'Image chargée ✓' : 'Uploader une image'}
                  </label>
                  <button 
                    onClick={saveArticle}
                    disabled={isLoading}
                    className="bg-green-600 px-6 py-3 rounded-lg font-bold flex items-center disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                    Publier
                  </button>
                </div>
              </div>
            )}
            
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Titre</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{art.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400">
                          {art.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{art.date}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => deleteArticle(art.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && !isLoading && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-500">Aucun article trouvé.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ai-assistant' && (
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
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                    >
                      {isTranslating ? <Loader2 className="animate-spin mr-2" size={16} /> : <Globe className="mr-2" size={16} />}
                      Traduire en Malagasy
                    </button>
                    <button 
                      onClick={() => {
                        setNewArticle(prev => ({ ...prev, content: generatedContent }));
                        setActiveTab('articles');
                        setShowNewForm(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
