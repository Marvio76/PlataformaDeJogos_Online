
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Trophy, Clock, Target, RotateCcw, CheckCircle } from 'lucide-react';
import MemoryGame from '@/components/games/MemoryGame';
import AssociationGame from '@/components/games/AssociationGame';
import QuizGame from '@/components/games/QuizGame';

const GamePlayer = ({ game, user, onNavigate }) => {
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      if (gameState === 'playing' && startTime) {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, startTime]);

  const handleGameComplete = (finalScore, finalMistakes) => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - (startTime || endTime)) / 1000);
    
    setScore(finalScore);
    setMistakes(finalMistakes);
    setTimeElapsed(totalTime);
    setGameState('finished');

    const result = {
      id: Date.now(),
      userId: user.id,
      gameId: game.id,
      gameTitle: game.title,
      gameType: game.type,
      score: finalScore,
      mistakes: finalMistakes,
      timeElapsed: totalTime,
      completedAt: new Date().toISOString()
    };

    const allResults = JSON.parse(localStorage.getItem('gameResults') || '[]');
    allResults.push(result);
    localStorage.setItem('gameResults', JSON.stringify(allResults));

    toast({
      title: "Parabéns!",
      description: `Você completou ${game.title} com ${finalScore} pontos!`,
    });
  };

  const handleRestart = () => {
    setGameState('playing');
    setScore(0);
    setTimeElapsed(0);
    setMistakes(0);
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGame = () => {
    const gameProps = {
      game,
      onComplete: handleGameComplete,
      onMistake: () => setMistakes(prev => prev + 1)
    };

    switch (game.type) {
      case 'memory':
        return <MemoryGame {...gameProps} />;
      case 'association':
        return <AssociationGame {...gameProps} />;
      case 'quiz':
        return <QuizGame {...gameProps} />;
      default:
        return <div>Tipo de jogo não suportado</div>;
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Jogo não encontrado</p>
          <Button onClick={() => onNavigate('dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => onNavigate('dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{game.title}</h1>
            <p className="text-gray-600">{game.description}</p>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>{score}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm">
            <Target className="w-4 h-4 text-red-600" />
            <span>{mistakes}</span>
          </div>
        </div>
      </header>

      <main>
        {gameState === 'playing' ? (
          <div>
            {renderGame()}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="bg-white shadow-lg max-w-md w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Jogo Concluído!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p>Sua pontuação final:</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-bold text-xl">{score}</p>
                    <p className="text-sm text-gray-500">Pontos</p>
                  </div>
                  <div>
                    <p className="font-bold text-xl">{formatTime(timeElapsed)}</p>
                    <p className="text-sm text-gray-500">Tempo</p>
                  </div>
                  <div>
                    <p className="font-bold text-xl">{mistakes}</p>
                    <p className="text-sm text-gray-500">Erros</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleRestart} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jogar Novamente
                  </Button>
                  <Button onClick={() => onNavigate('dashboard')} variant="outline" className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePlayer;
