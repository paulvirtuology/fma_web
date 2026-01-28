
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
      case 'missions':
      case 'news':
      case 'contact':
        return (
          <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-white">
            <div className="text-center space-y-4 max-w-lg px-4">
              <h1 className="text-4xl font-bold text-blue-900 italic">Page en cours de développement</h1>
              <p className="text-slate-600">
                Nous préparons avec soin le contenu de cette section pour mieux vous servir. Revenez bientôt !
              </p>
              <button 
                onClick={() => setCurrentView('home')}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        );
      default:
        return <Home />;
    }
  };

  const isDashboard = currentView === 'admin';

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

export default App;
