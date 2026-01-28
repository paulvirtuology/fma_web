import React, { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  Save,
  Check,
  Sparkles,
  Globe
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { generateNewsDraft, translateToMalagasy } from '../services/geminiService';
import { NewsArticle, ContentBlock, Page, SiteSetting, User, UserRole } from '../types';

import Sidebar, { AdminTab } from '../components/admin/Sidebar';
import OverviewTab from '../components/admin/OverviewTab';
import ArticlesTab from '../components/admin/ArticlesTab';
import PagesTab from '../components/admin/PagesTab';
import ContentBlocksTab from '../components/admin/ContentBlocksTab';
import UsersTab from '../components/admin/UsersTab';
import SettingsTab from '../components/admin/SettingsTab';
import AIAssistantTab from '../components/admin/AIAssistantTab';
import MediaLibrary from '../components/admin/MediaLibrary';
import { mediaService } from '../services/mediaService';

const AdminDashboard: React.FC = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // User management state
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'editor' as UserRole, full_name: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // AI State
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Form State for new article
  const [showNewForm, setShowNewForm] = useState(false);
  const [showCreatePageModal, setShowCreatePageModal] = useState(false);
  const [showCreateBlockModal, setShowCreateBlockModal] = useState(false);
  const [newPageData, setNewPageData] = useState({ title: '', slug: '' });
  const [newBlockData, setNewBlockData] = useState({ key: '', page: 'home', section: 'main' });
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: 'Événement',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const promises: Promise<any>[] = [
        dataService.getArticles(),
        dataService.getContentBlocks(),
        dataService.getPages(),
        dataService.getSiteSettings()
      ];
      if (isAdmin) {
        promises.push(authService.getAllUsers());
      }
      const [articlesData, blocksData, pagesData, settingsData, usersData] = await Promise.all(promises);
      setArticles(articlesData);
      setContentBlocks(blocksData);
      setPages(pagesData);
      setSettings(settingsData);
      if (usersData) setUsers(usersData);
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
      const url = await mediaService.uploadOptimized(e.target.files[0]);
      if (editingArticle) {
        setEditingArticle(prev => prev ? { ...prev, image: url } : null);
      } else {
        setNewArticle(prev => ({ ...prev, image: url }));
      }
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

  const updateArticle = async (id: string, updates: Partial<NewsArticle>) => {
    // Optimistic update
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

    const article = articles.find(a => a.id === id);
    if (!article) return;
    try {
      await dataService.createArticle({ ...article, ...updates }); // createArticle handles upsert
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const updateContentBlock = async (id: string, updates: Partial<ContentBlock>) => {
    // Optimistic update
    setContentBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

    const block = contentBlocks.find(b => b.id === id);
    if (!block) return;
    try {
      await dataService.upsertContentBlock({ ...block, ...updates });
    } catch (err) {
      console.error(err);
      loadData(); // Revert on error
    }
  };

  const deleteContentBlock = async (id: string) => {
    if (!confirm("Supprimer ce bloc ?")) return;
    try {
      await dataService.deleteContentBlock(id);
      loadData();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const moveBlock = async (id: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentBlocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const blockA = contentBlocks[index];
    const blockB = contentBlocks[targetIndex];

    try {
      await Promise.all([
        dataService.upsertContentBlock({ ...blockA, order_index: blockB.order_index }),
        dataService.upsertContentBlock({ ...blockB, order_index: blockA.order_index })
      ]);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    // Optimistic update
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    const page = pages.find(p => p.id === id);
    if (!page) return;
    try {
      await dataService.upsertPage({ ...page, ...updates });
    } catch (err) {
      console.error(err);
      loadData(); // Revert on error
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Supprimer cette page ?")) return;
    try {
      await dataService.deletePage(id);
      loadData();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      await authService.createUser(newUser.email, newUser.password, newUser.role, newUser.full_name);
      setShowUserForm(false);
      setNewUser({ email: '', password: '', role: 'editor', full_name: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: { role?: UserRole; full_name?: string; email?: string }) => {
    try {
      await authService.updateUser(userId, updates);
      loadData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la modification");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await authService.deleteUser(userId);
      loadData();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      setIsLoading(true);
      await authService.updatePassword(passwordData.newPassword);
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert("Mot de passe modifié avec succès");
    } catch (err: any) {
      alert(err.message || "Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        user={currentUser}
        setShowPasswordForm={setShowPasswordForm}
        handleLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && <OverviewTab articles={articles} setActiveTab={setActiveTab} />}

        {activeTab === 'articles' && (
          <ArticlesTab
            articles={articles}
            showNewForm={showNewForm}
            setShowNewForm={setShowNewForm}
            newArticle={newArticle}
            setNewArticle={setNewArticle}
            handleFileUpload={handleFileUpload}
            saveArticle={saveArticle}
            deleteArticle={deleteArticle}
            updateArticle={updateArticle}
            editingArticle={editingArticle}
            setEditingArticle={setEditingArticle}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'content' && (
          <ContentBlocksTab
            contentBlocks={contentBlocks}
            handleCreateBlock={() => setShowCreateBlockModal(true)}
            updateContentBlock={updateContentBlock}
            deleteContentBlock={deleteContentBlock}
            moveBlock={moveBlock}
          />
        )}

        {activeTab === 'pages' && (
          <PagesTab
            pages={pages}
            handleCreatePage={() => setShowCreatePageModal(true)}
            updatePage={updatePage}
            deletePage={deletePage}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            loadData={loadData}
            upsertSiteSetting={dataService.upsertSiteSetting}
          />
        )}

        {activeTab === 'users' && isAdmin && (
          <UsersTab
            users={users}
            currentUser={currentUser}
            showUserForm={showUserForm}
            setShowUserForm={setShowUserForm}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            newUser={newUser}
            setNewUser={setNewUser}
            handleCreateUser={handleCreateUser}
            handleUpdateUser={handleUpdateUser}
            handleDeleteUser={handleDeleteUser}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'media' && <MediaLibrary />}

        {/* Proper Creation Modals */}
        {showCreatePageModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold mb-6">Créer une Page</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Titre de la page</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="ex: À propos de nous"
                    value={newPageData.title}
                    onChange={e => setNewPageData(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Slug (URL)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="ex: about"
                    value={newPageData.slug}
                    onChange={e => setNewPageData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreatePageModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!newPageData.title || !newPageData.slug) return;
                      await dataService.upsertPage({ ...newPageData, content: '', is_published: true });
                      setShowCreatePageModal(false);
                      setNewPageData({ title: '', slug: '' });
                      loadData();
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
                  >
                    Créer la Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCreateBlockModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold mb-6">Nouveau Bloc de Contenu</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Clé unique</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="ex: hero_intro"
                    value={newBlockData.key}
                    onChange={e => setNewBlockData(p => ({ ...p, key: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Page</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="home"
                      value={newBlockData.page}
                      onChange={e => setNewBlockData(p => ({ ...p, page: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Section</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="main"
                      value={newBlockData.section}
                      onChange={e => setNewBlockData(p => ({ ...p, section: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateBlockModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!newBlockData.key) return;
                      await dataService.upsertContentBlock({ ...newBlockData, order_index: 0 });
                      setShowCreateBlockModal(false);
                      setNewBlockData({ key: '', page: 'home', section: 'main' });
                      loadData();
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
                  >
                    Ajouter le Bloc
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          <AIAssistantTab
            aiTopic={aiTopic}
            setAiTopic={setAiTopic}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            generatedContent={generatedContent}
            setGeneratedContent={setGeneratedContent}
            isTranslating={isTranslating}
            handleTranslate={handleTranslate}
            onUseContent={(content) => {
              setNewArticle(prev => ({ ...prev, content }));
              setActiveTab('articles');
              setShowNewForm(true);
            }}
          />
        )}

        {showPasswordForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Changer le mot de passe</h2>
                <button onClick={() => setShowPasswordForm(false)}><X size={20} /></button>
              </div>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="bg-green-600 px-6 py-3 rounded-lg font-bold flex items-center disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
