
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import ContentManager from '@/components/ContentManager';
import GameGenerator from '@/components/GameGenerator';
import GamePlayer from '@/components/GamePlayer';
import ResultsManager from '@/components/ResultsManager';
import ShareManager from '@/components/ShareManager';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedGame, setSelectedGame] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo(a), ${user.name}!`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handlePlayGame = (game) => {
    setSelectedGame(game);
    setCurrentPage('game-player');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
            onPlayGame={handlePlayGame}
          />
        );
      case 'content-manager':
        return (
          <ContentManager
            user={currentUser}
            onNavigate={setCurrentPage}
          />
        );
      case 'game-generator':
        return (
          <GameGenerator
            user={currentUser}
            onNavigate={setCurrentPage}
            onPlayGame={handlePlayGame}
          />
        );
      case 'game-player':
        return (
          <GamePlayer
            game={selectedGame}
            user={currentUser}
            onNavigate={setCurrentPage}
          />
        );
      case 'results-manager':
        return (
          <ResultsManager
            user={currentUser}
            onNavigate={setCurrentPage}
          />
        );
      case 'share-manager':
        return (
          <ShareManager
            user={currentUser}
            onNavigate={setCurrentPage}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Plataforma de Jogos Educativos</title>
        <meta name="description" content="Plataforma para criação e compartilhamento de jogos educativos." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="min-h-screen">
          {renderCurrentPage()}
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
