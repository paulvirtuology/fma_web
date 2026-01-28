
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import PageComponent from './pages/Page';
import ArticleDetail from './pages/ArticleDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { View } from './types';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/login') {
      setCurrentView('login' as View);
    } else if (path === '/reset-password') {
      setCurrentView('reset-password' as View);
    } else if (path === '/admin' || path.startsWith('/admin')) {
      setCurrentView('admin');
    }
  }, []);

  useEffect(() => {
    if (currentView === 'admin' && !loading && !user) {
      window.location.href = '/login';
    }
  }, [currentView, user, loading]);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} onViewArticle={(id) => { setSelectedArticleId(id); setCurrentView('article-detail'); }} />;
      case 'admin':
        if (loading) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
              <div className="text-center space-y-4">
                <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
                <p className="text-slate-400">Chargement...</p>
              </div>
            </div>
          );
        }
        if (!user) {
          return <Login />;
        }
        return <AdminDashboard />;
      case 'login':
        return <Login />;
      case 'reset-password':
        return <ResetPassword />;
      case 'about':
        return <PageComponent slug="about" />;
      case 'missions':
        return <PageComponent slug="missions" />;
      case 'news':
        return <PageComponent slug="news" />;
      case 'contact':
        return <PageComponent slug="contact" />;
      case 'article-detail':
        return selectedArticleId ? (
          <ArticleDetail id={selectedArticleId} onBack={() => setCurrentView('home')} />
        ) : <Home onNavigate={setCurrentView} onViewArticle={(id) => { setSelectedArticleId(id); setCurrentView('article-detail'); }} />;
      default:
        return <Home onNavigate={setCurrentView} onViewArticle={(id) => { setSelectedArticleId(id); setCurrentView('article-detail'); }} />;
    }
  };

  const isDashboard = currentView === 'admin' || currentView === 'login' || currentView === 'reset-password';

  return (
    <div className="min-h-screen">
      {!isDashboard && (
        <Navbar currentView={currentView} onNavigate={setCurrentView} />
      )}

      <main>
        {renderContent()}
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
