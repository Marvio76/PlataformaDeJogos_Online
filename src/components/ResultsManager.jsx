import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Clock, Target } from 'lucide-react';

const ResultsManager = ({ user, onNavigate }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://plataformadejogos-online.onrender.com/api/game-results?userId=${user.id}`);
        const data = await response.json();

        // Filtra só os resultados do usuário atual
        const userResults = data.filter(result => result.userId === user.id);

        // Ordena do mais recente para o mais antigo
        const sortedResults = userResults.sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );

        setResults(sortedResults);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user.id]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameTypeLabel = (type) => {
    switch (type) {
      case 'memory': return 'Memória';
      case 'association': return 'Associação';
      case 'quiz': return 'Quiz';
      case 'guess-term': return 'Quem é?';
      default: return type;
    }
  };
  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={() => onNavigate('dashboard')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Resultados</h1>
          <p className="text-gray-600">Seu histórico de jogos</p>
        </div>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Histórico de Partidas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-500 p-6">Carregando resultados...</div>
          ) : results.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{result.gameTitle}</h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(result.completedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-medium">
                      {getGameTypeLabel(result.gameType)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                      <p className="font-semibold">{result.score}</p>
                      <p className="text-gray-500 text-xs">Pontos</p>
                    </div>
                    <div>
                      <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <p className="font-semibold">{formatTime(result.timeElapsed)}</p>
                      <p className="text-gray-500 text-xs">Tempo</p>
                    </div>
                    <div>
                      <Target className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <p className="font-semibold">{result.mistakes}</p>
                      <p className="text-gray-500 text-xs">Erros</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Nenhum jogo jogado ainda</p>
              <p className="text-sm mt-2">Jogue alguns jogos para ver seus resultados aqui!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsManager;
