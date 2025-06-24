
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Gamepad2, 
  Share2, 
  BarChart3, 
  LogOut, 
  User,
  Play,
} from 'lucide-react';

const Dashboard = ({ user, onNavigate, onLogout, onPlayGame }) => {
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    const games = JSON.parse(localStorage.getItem('games') || '[]');
    const userGames = games.filter(g => g.userId === user.id).slice(0, 4);
    setRecentGames(userGames);
  }, [user.id]);

  const menuItems = [
    {
      title: 'Gerenciar Conteúdo',
      description: 'Cadastre termos e definições',
      icon: BookOpen,
      action: () => onNavigate('content-manager')
    },
    {
      title: 'Gerar Jogos',
      description: 'Crie jogos automaticamente',
      icon: Gamepad2,
      action: () => onNavigate('game-generator')
    },
    {
      title: 'Compartilhar',
      description: 'Compartilhe seus jogos',
      icon: Share2,
      action: () => onNavigate('share-manager')
    },
    {
      title: 'Resultados',
      description: 'Veja suas pontuações',
      icon: BarChart3,
      action: () => onNavigate('results-manager')
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-4 shadow-sm rounded-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Olá, {user.name}!
          </h1>
          <p className="text-gray-600">Bem-vindo à sua plataforma de jogos</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-sm">{user.email}</span>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">O que você quer fazer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Card 
                key={item.title}
                className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
                onClick={item.action}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                     <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {recentGames.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Jogos Recentes</h2>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{game.title}</h4>
                        <p className="text-gray-500 text-sm">{game.description}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => onPlayGame(game)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Jogar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
