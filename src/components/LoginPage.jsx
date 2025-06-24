import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Gamepad2, Play, Zap } from 'lucide-react';

const API_BASE = 'http://localhost:3001'; // ajuste conforme seu backend

const GameGenerator = ({ user, onNavigate, onPlayGame }) => {
  const [content, setContent] = useState([]);
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    difficulty: 'medium',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [contentRes, gamesRes] = await Promise.all([
          fetch(`${API_BASE}/content/${user.id}`),
          fetch(`${API_BASE}/games/${user.id}`)
        ]);

        if (!contentRes.ok) throw new Error('Erro ao carregar conteúdos');
        if (!gamesRes.ok) throw new Error('Erro ao carregar jogos');

        const contentData = await contentRes.json();
        const gamesData = await gamesRes.json();

        setContent(Array.isArray(contentData) ? contentData : []);
        setGames(Array.isArray(gamesData) ? gamesData : []);
      } catch (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
        setContent([]);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.type || content.length < 3) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos e tenha pelo menos 3 conteúdos cadastrados.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedContent = content.slice(0, 10);
      const payload = {
        userId: user.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        difficulty: formData.difficulty,
        content: selectedContent,
      };

      const res = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao criar jogo');
      }

      toast({
        title: "Jogo criado com sucesso!",
        description: `${formData.title} está pronto para jogar.`,
      });

      setFormData({ title: '', description: '', type: '', difficulty: 'medium' });

      // Atualiza lista de jogos
      const gamesRes = await fetch(`${API_BASE}/games/${user.id}`);
      const gamesData = await gamesRes.json();
      setGames(Array.isArray(gamesData) ? gamesData : []);
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-50">
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
        <Card className="bg-white shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Criar Novo Jogo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Jogo</Label>
                <Input
                  id="title"
                  placeholder="Digite o título..."
                  value={formData.title}
                  onChange={handleChange('title')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o jogo..."
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Jogo</Label>
                <Select onValueChange={handleSelectChange} value={formData.type}>
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
                disabled={isLoading || content.length < 3}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isLoading ? 'Gerando...' : 'Gerar Jogo'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg lg:col-span-2">
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
                  <div key={game.id} className="border rounded-lg p-4">
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
  );
};

export default GameGenerator;
