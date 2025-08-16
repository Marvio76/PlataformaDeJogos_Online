import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Share2, Copy, Users } from 'lucide-react';

const ShareManager = ({ user, onNavigate }) => {
  const [games, setGames] = useState([]);
  const [sharedGames, setSharedGames] = useState([]);
  const { toast } = useToast();
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingShared, setLoadingShared] = useState(true);

  // Busca jogos do usuário via backend
  const loadGames = async () => {
    setLoadingGames(true);
    try {
      const res = await fetch(`https://plataformadejogos-online.onrender.com/api/games?userId=${user.id}`);
      if (!res.ok) throw new Error('Erro ao carregar jogos');
      const data = await res.json();
      setGames(data);
    } catch (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingGames(false);
    }
  };

  // Busca jogos compartilhados via backend
  const loadSharedGames = async () => {
    setLoadingShared(true);
    try {
      const res = await fetch(`https://plataformadejogos-online.onrender.com/api/shared-games?userId=${user.id}`);
      if (!res.ok) throw new Error('Erro ao carregar jogos compartilhados');
      const data = await res.json();
      setSharedGames(data);
    } catch (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingShared(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadGames();
      loadSharedGames();
    }
  }, [user.id]);

  // Gera código de compartilhamento aleatório
  const generateShareCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  // Envia compartilhamento para o backend
  const handleShareGame = async (game) => {
    const code = generateShareCode();
    const shareData = {
      userId: user.id,
      gameId: game._id || game.id,
      gameTitle: game.title,
      gameType: game.type,
      shareCode: code,
      shareLink: `${window.location.origin}/play?code=${code}`,
    };

    try {
      const res = await fetch('https://plataformadejogos-online.onrender.com/api/shared-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erro ao compartilhar o jogo');
      }
      toast({ title: 'Jogo compartilhado!', description: `Código: ${code}` });
      loadSharedGames(); // atualiza lista de compartilhados
    } catch (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    }
  };

  // Copia código para a área de transferência
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Copiado!', description: 'Código copiado para a área de transferência.' });
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Compartilhar Jogos</h1>
          <p className="text-gray-600">Compartilhe seus jogos com outros</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Selecione um Jogo para Compartilhar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingGames ? (
                <div className="text-center py-8 text-gray-500">Carregando jogos...</div>
              ) : games.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Share2 className="w-12 h-12 mx-auto mb-4" />
                  <p>Nenhum jogo criado para compartilhar.</p>
                </div>
              ) : (
                games.map((game) => (
                  <div key={game._id || game.id} className="border p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{game.title}</h3>
                      <p className="text-sm text-gray-500">{game.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleShareGame(game)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Jogos Compartilhados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingShared ? (
                <div className="text-center py-8 text-gray-500">Carregando jogos compartilhados...</div>
              ) : sharedGames.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p>Nenhum jogo foi compartilhado ainda.</p>
                </div>
              ) : (
                sharedGames.map((shared) => (
                  <div key={shared._id || shared.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{shared.gameTitle}</h3>
                    <p className="text-sm text-gray-500">Código de acesso:</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Input value={shared.shareCode} readOnly className="font-mono" />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(shared.shareCode)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShareManager;
