import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GuessTermGame = ({ game, onFinish }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (game?.data?.length > 0) {
            initializeGame();
        } else {
            setQuestions([]);
        }
    }, [game]);

    const initializeGame = () => {
        const normalized = game.data.map((item, index) => ({
            term: item.term || item.termo || item.title || 'Termo desconhecido',
            definition: item.definition || item.definição || item.description || 'Definição desconhecida',
            id: item.id || item._id || index.toString()
        }));
        const shuffled = normalized.sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setAnswer('');
        setScore(0);
        setMistakes(0);
        setShowAnswer(false);
        setFinished(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const correct = questions[currentIndex].term.trim().toLowerCase();
        const userAnswer = answer.trim().toLowerCase();

        if (userAnswer === correct) {
            setScore((prev) => prev + 1);
            next();
        } else {
            setMistakes((prev) => prev + 1);
            setShowAnswer(true);
        }
    };

    const next = () => {
        setShowAnswer(false);
        setAnswer('');
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setFinished(true);
            onFinish(score, mistakes);
        }
    };

    const skip = () => {
        setMistakes((prev) => prev + 1);
        setShowAnswer(false);
        next();
    };

    if (finished) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Fim do jogo!</h2>
                <p className="mb-2">Pontuação: <span className="font-bold">{score}</span> de {questions.length}</p>
                <p className="mb-2 text-red-600">Erros: <span className="font-bold">{mistakes}</span></p>
                <Button onClick={() => onFinish(score, mistakes)} className="bg-blue-600 text-white mt-4">Voltar</Button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <Card className="p-6 bg-white shadow-md mb-4">
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Quem é? (Adivinhe o Termo)</h2>
                    <p className="mb-2 text-gray-600">Definição:</p>
                    <div className="mb-4 p-3 bg-blue-100 rounded">
                        {questions[currentIndex]?.definition}
                    </div>
                    <form onSubmit={handleSubmit} className="mb-2">
                        <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            placeholder="Digite o termo..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            disabled={showAnswer}
                        />
                        <Button type="submit" className="mt-2 w-full bg-green-600 text-white">Responder</Button>
                    </form>
                    <Button onClick={skip} className="w-full bg-gray-400 text-white mt-2">Pular</Button>
                    {showAnswer && (
                        <div className="mt-4 p-2 bg-red-100 rounded text-red-700">
                            <p>Resposta correta: <span className="font-bold">{questions[currentIndex].term}</span></p>
                            <Button onClick={next} className="mt-2 bg-blue-600 text-white">Próxima</Button>
                        </div>
                    )}
                    <div className="mt-4 text-sm text-gray-500">Pergunta {currentIndex + 1} de {questions.length}</div>
                    <div className="mt-1 text-sm text-gray-700">Pontuação: {score}</div>
                    <div className="mt-1 text-sm text-red-600">Erros: {mistakes}</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GuessTermGame;