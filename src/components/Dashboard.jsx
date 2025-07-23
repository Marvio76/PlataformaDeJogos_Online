import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  Gamepad2,
  Share2,
  BarChart3,
  LogOut,
  User,
  Play,
  Search,
  Brain,
  Link,
  HelpCircle,
} from 'lucide-react';

const Dashboard = ({ user, onNavigate, onLogout, onPlayGame }) => {
  const [games, setGames] = useState([]);
  const [sharedGames, setSharedGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [loading, setLoading] = useState(false);
  const [externalSharedGame, setExternalSharedGame] = useState(null);

  useEffect(() => {
    const fetchAllGames = async () => {
      setLoading(true);
      try {
        const resGames = await fetch(`http://localhost:3001/api/games?userId=${user.id}`);
        const dataGames = resGames.ok ? await resGames.json() : [];
        setGames(dataGames.slice(0, 20));

        const resShared = await fetch(`http://localhost:3001/api/shared-games?userId=${user.id}`);
        let dataShared = resShared.ok ? await resShared.json() : [];
        if (!Array.isArray(dataShared)) dataShared = [dataShared];
        setSharedGames(
          dataShared
            .filter(item => item && item.shareCode && item.gameTitle)
            .map(item => ({
              _id: item.id || item._id || item.gameId || Math.random().toString(),
              title: item.gameTitle,
              description: 'Jogo compartilhado',
              gameType: item.gameType || '',
              visibility: 'public',
              createdBy: item.userId,
              shareCode: item.shareCode,
              gameId: item.gameId,
            }))
        );
      } catch (e) {
        setGames([]);
        setSharedGames([]);
      }
      setLoading(false);
    };

    fetchAllGames();
  }, [user.id]);

  useEffect(() => {
    setExternalSharedGame(null);
  }, [searchTerm]);

  // Busca por código: procura nos compartilhados, se não achar busca externamente
  const isCodeSearch = searchTerm.length >= 4 && /^[a-zA-Z0-9]+$/.test(searchTerm);

  let searchGames;
  if (isCodeSearch) {
    // Procura localmente primeiro
    const shared = sharedGames.find(
      game => game.shareCode && game.shareCode.toLowerCase() === searchTerm.toLowerCase()
    );
    if (shared) {
      searchGames = [shared];
    } else if (externalSharedGame) {
      searchGames = [externalSharedGame];
    } else {
      // Busca externa se não achou localmente
      fetch(`http://localhost:3001/api/shared-games/by-code/${searchTerm}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setExternalSharedGame({
            ...data,
            _id: data._id || data.id || data.gameId || Math.random().toString(),
            title: data.gameTitle,
            description: 'Jogo compartilhado externo',
            gameType: data.gameType || '',
            visibility: 'public',
            createdBy: data.userId,
            shareCode: data.shareCode,
            gameId: data.gameId,
          });
        });
      searchGames = [];
    }
  } else {
    // Busca normal, sem duplicados (prioriza jogos do usuário)
    const gamesMap = new Map();
    games.forEach(game => {
      const key = game.title?.trim().toLowerCase();
      gamesMap.set(key, game);
    });
    sharedGames.forEach(game => {
      const key = game.title?.trim().toLowerCase();
      if (!gamesMap.has(key)) {
        gamesMap.set(key, game);
      }
    });
    searchGames = Array.from(gamesMap.values());
  }

  const filteredGames = searchGames.filter((game) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      game.title?.toLowerCase().includes(search) ||
      (game.shareCode && game.shareCode.toLowerCase().includes(search));

    const matchesType = filterType === 'all' || game.gameType === filterType;

    let matchesVisibility = true;
    if (filterVisibility === 'public') {
      matchesVisibility = game.visibility === 'public';
    } else if (filterVisibility === 'private') {
      matchesVisibility = game.visibility === 'private' && game.createdBy === user.id;
    } else {
      matchesVisibility =
        game.visibility === 'public' ||
        (game.visibility === 'private' && game.createdBy === user.id);
    }

    return matchesSearch && matchesType && matchesVisibility;
  });

  const typeNameMap = {
    memory: 'Memória',
    association: 'Associação',
    quiz: 'Quiz',
  };

  const typeIconMap = {
    Memória: Brain,
    Associação: Link,
    Quiz: HelpCircle,
  };

  const menuItems = [
    {
      title: 'Gerenciar Conteúdo',
      description: 'Cadastre termos e definições',
      icon: BookOpen,
      action: () => onNavigate('content-manager'),
    },
    {
      title: 'Gerar Jogos',
      description: 'Crie jogos automaticamente',
      icon: Gamepad2,
      action: () => onNavigate('game-generator'),
    },
    {
      title: 'Compartilhar',
      description: 'Compartilhe seus jogos',
      icon: Share2,
      action: () => onNavigate('share-manager'),
    },
    {
      title: 'Resultados',
      description: 'Veja suas pontuações',
      icon: BarChart3,
      action: () => onNavigate('results-manager'),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-4 shadow-sm rounded-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olá, {user.name}!</h1>
          <p className="text-gray-600">Bem-vindo à sua plataforma de jogos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-sm">{user.email}</span>
          </div>
          <Button onClick={onLogout} variant="outline">
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

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Jogos Recentes</h2>
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="memory">Memória</option>
              <option value="association">Associação</option>
              <option value="quiz">Quiz</option>
              <option value="guess-term">Quem é? (Adivinhe o Termo)</option>
            </select>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
            </select>
          </div>

          {loading ? (
            <p className="text-gray-500 mt-2">Carregando...</p>
          ) : filteredGames.length > 0 ? (
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGames.map((game) => {
                    const Icon = typeIconMap[typeNameMap[game.gameType]] || HelpCircle;
                    const visibilityLabel =
                      game.visibility === 'public'
                        ? 'Público'
                        : game.createdBy === user.id
                        ? 'Privado'
                        : 'Privado (Não seu)';
                    return (
                      <div
                        key={game._id}
                        className="border rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">{game.title}</h4>
                          <p className="text-gray-500 text-sm mb-2">{game.description}</p>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700 text-sm font-medium">
                              {typeNameMap[game.gameType] || 'Tipo não informado'}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-gray-500 mt-1">
                            {visibilityLabel}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          onClick={async () => {
                            // Se for um jogo compartilhado e tiver gameId, busque o jogo real
                            if (game.shareCode && game.gameId) {
                              try {
                                const res = await fetch(`http://localhost:3001/api/games/${game.gameId}`);
                                if (res.ok) {
                                  const fullGame = await res.json();
                                  onPlayGame(fullGame);
                                  return;
                                }
                              } catch (e) {
                                // Se der erro, cai para o próximo bloco
                              }
                            }
                            // Caso contrário, joga normalmente
                            onPlayGame(game);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Jogar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-gray-500 mt-2">Nenhum jogo encontrado com esses filtros.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;