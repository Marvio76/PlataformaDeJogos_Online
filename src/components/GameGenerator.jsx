
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Gamepad2, Play, Zap } from 'lucide-react';

const GameGenerator = ({ user, onNavigate, onPlayGame }) => {
  const [content, setContent] = useState([]);
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    difficulty: 'medium',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
    loadGames();
  }, [user.id]);

  const loadContent = () => {
    const allContent = JSON.parse(localStorage.getItem('content') || '[]');
    const userContent = allContent.filter(c => c.userId === user.id);
    setContent(userContent);
  };

  const loadGames = () => {
    const allGames = JSON.parse(localStorage.getItem('games') || '[]');
    const userGames = allGames.filter(g => g.userId === user.id);
    setGames(userGames);
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

    setTimeout(() => {
      const selectedContent = content.slice(0, Math.min(content.length, 10));
      
      const newGame = {
        id: Date.now(),
        userId: user.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        difficulty: formData.difficulty,
        content: selectedContent,
        createdAt: new Date().toISOString()
      };

      const allGames = JSON.parse(localStorage.getItem('games') || '[]');
      allGames.push(newGame);
      localStorage.setItem('games', JSON.stringify(allGames));

      toast({
        title: "Jogo criado com sucesso!",
        description: `${formData.title} está pronto para jogar.`,
      });

      setFormData({ title: '', description: '', type: '', difficulty: 'medium' });
      setIsGenerating(false);
      loadGames();
    }, 1000);
  };

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
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o jogo..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                   <Label>Tipo de Jogo</Label>
                   <Select onValueChange={(value) => setFormData({...formData, type: value})} value={formData.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de jogo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="memory">Jogo da Memória</SelectItem>
                        <SelectItem value="association">Jogo de Associação</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
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
                    <div
                      key={game.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{game.title}</h3>
                          <p className="text-sm text-gray-600">{game.description}</p>
                          <span className="text-xs text-gray-500 mt-1 inline-block">
                            Tipo: {game.type}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onPlayGame(game)}
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