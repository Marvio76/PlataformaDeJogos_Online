
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizGame = ({ game, onComplete, onMistake }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    initializeGame();
  }, [game]);

  const initializeGame = () => {
    const gameQuestions = game.content.map((item) => {
      const wrongAnswers = game.content
        .filter(c => c.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(c => c.definition);
      
      const options = [item.definition, ...wrongAnswers].sort(() => 0.5 - Math.random());
      
      return {
        question: `O que significa "${item.term}"?`,
        options: options,
        correctAnswer: item.definition,
      };
    });

    setQuestions(gameQuestions.sort(() => 0.5 - Math.random()));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setMistakes(0);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
    } else {
      setMistakes(prev => prev + 1);
      onMistake();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      onComplete(score, mistakes);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center p-8">Carregando perguntas...</div>;
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = question.correctAnswer === option;
              
              let buttonClass = "bg-white hover:bg-gray-100 text-gray-800";
              if(showResult) {
                if(isCorrect) buttonClass = "bg-green-200 text-green-800";
                if(isSelected && !isCorrect) buttonClass = "bg-red-200 text-red-800";
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full p-4 h-auto text-left justify-start transition-colors ${buttonClass}`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-6 text-center">
              <Button onClick={handleNextQuestion}>
                {currentQuestion + 1 >= questions.length ? 'Finalizar Jogo' : 'Próxima Pergunta'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizGame;
