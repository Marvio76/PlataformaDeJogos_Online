
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

  useEffect(() => {
    loadGames();
    loadSharedGames();
  }, [user.id]);

  const loadGames = () => {
    const allGames = JSON.parse(localStorage.getItem('games') || '[]');
    const userGames = allGames.filter(g => g.userId === user.id);
    setGames(userGames);
  };

  const loadSharedGames = () => {
    const allShared = JSON.parse(localStorage.getItem('sharedGames') || '[]');
    const userShared = allShared.filter(s => s.userId === user.id);
    setSharedGames(userShared);
  };

  const generateShareCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleShareGame = (game) => {
    const code = generateShareCode();
    const shareData = {
      id: Date.now(),
      userId: user.id,
      gameId: game.id,
      gameTitle: game.title,
      gameType: game.type,
      shareCode: code,
      shareLink: `${window.location.origin}?play=${code}`,
      createdAt: new Date().toISOString(),
      accessCount: 0
    };

    const allShared = JSON.parse(localStorage.getItem('sharedGames') || '[]');
    allShared.push(shareData);
    localStorage.setItem('sharedGames', JSON.stringify(allShared));

    loadSharedGames();

    toast({
      title: "Jogo compartilhado!",
      description: `Código de acesso: ${code}`,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: "O código foi copiado.",
      });
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
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {games.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Share2 className="w-12 h-12 mx-auto mb-4" />
                    <p>Nenhum jogo criado para compartilhar.</p>
                  </div>
                ) : (
                  games.map((game) => (
                    <div key={game.id} className="border p-4 rounded-lg flex justify-between items-center">
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
              </div>
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
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {sharedGames.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <p>Nenhum jogo foi compartilhado ainda.</p>
                  </div>
                ) : (
                  sharedGames.map((shared) => (
                    <div key={shared.id} className="border p-4 rounded-lg">
                      <h3 className="font-semibold">{shared.gameTitle}</h3>
                      <p className="text-sm text-gray-500">
                        Código de acesso:
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={shared.shareCode} readOnly className="font-mono"/>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShareManager;
