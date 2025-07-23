import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Gamepad2, Play, Zap, Lock, Globe } from 'lucide-react';
import GuessTermGame from './games/GuessTermGame';

const GameGenerator = ({ user, onNavigate, onPlayGame }) => {
  const [content, setContent] = useState([]);
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    difficulty: 'medium',
    visibility: 'private'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    loadContent();
    loadGames();
  }, [user.id]);

  const loadContent = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/content?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar conteúdos do servidor');
      }
      const data = await response.json();
      setContent(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os conteúdos.",
        variant: "destructive",
      });
    }
  };

  const loadGames = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/games");
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos do servidor');
      }
      const data = await response.json();
      const userGames = data.filter(game => game.createdBy === user.id);
      setGames(userGames);
    } catch (error) {
      toast({
        title: "Erro ao carregar jogos",
        description: error.message || "Não foi possível buscar os jogos do servidor.",
        variant: "destructive",
      });
    }
  };

  const generateGame = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.type || content.length < 3) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos e tenha pelo menos 3 conteúdos cadastrados.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    const selectedContent = content.slice(0, Math.min(content.length, 10));

    const newGame = {
      title: formData.title,
      description: formData.description,
      gameType: formData.type,
      data: selectedContent,
      createdBy: user.id,
      visibility: formData.visibility
    };

    try {
      const response = await fetch("http://localhost:3001/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      });

      if (response.ok) {
        toast({
          title: "Jogo criado com sucesso!",
          description: `${formData.title} está pronto para jogar.`,
        });
        setFormData({ title: '', description: '', type: '', difficulty: 'medium', visibility: 'private' });
        loadGames();
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao criar jogo",
          description: errorData.message || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível se conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para jogar
  const handlePlayGame = (game) => {
    if (game.gameType === 'guess-term') {
      setActiveGame(game);
    } else {
      onPlayGame(game);
    }
  };

  // Renderização condicional para GuessTermGame
  if (activeGame && activeGame.gameType === 'guess-term') {
    return (
      <GuessTermGame
        game={activeGame}
        onFinish={() => setActiveGame(null)}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Gerar Jogos</h1>
          <p className="text-gray-600">Crie jogos a partir do seu conteúdo</p>
        </div>
      </div>

      {content.length < 3 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Atenção</p>
          <p>Você precisa de pelo menos 3 conteúdos cadastrados para gerar jogos.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Criar Novo Jogo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={generateGame} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Jogo</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o jogo..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Jogo</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, type: value })} value={formData.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de jogo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="memory">Jogo da Memória</SelectItem>
                      <SelectItem value="association">Jogo de Associação</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="guess-term">Quem é? (Adivinhe o Termo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Visibilidade</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha a visibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Público
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Privado
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isGenerating || content.length < 3}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Gerando...' : 'Gerar Jogo'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Jogos Criados ({games.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {games.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gamepad2 className="w-12 h-12 mx-auto mb-4" />
                    <p>Nenhum jogo criado ainda</p>
                  </div>
                ) : (
                  games.map((game) => (
                    <div key={game._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{game.title}</h3>
                          <p className="text-sm text-gray-600">{game.description}</p>
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span>Tipo: {game.gameType}</span>
                            <span className="flex items-center gap-1">
                              {game.visibility === 'public' ? (
                                <>
                                  <Globe className="w-3 h-3 text-green-600" /> Público
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-gray-600" /> Privado
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePlayGame(game)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Jogar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameGenerator;