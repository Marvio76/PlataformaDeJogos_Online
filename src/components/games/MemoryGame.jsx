import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MemoryGame = ({ game, onComplete, onMistake }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (game?.data?.length > 0) {
      initializeGame();
    } else {
      setCards([]);
    }
  }, [game]);

  useEffect(() => {
    if (cards.length > 0 && matchedPairs.length === cards.length) {
      onComplete(score, mistakes);
    }
  }, [matchedPairs, score, mistakes, cards.length, onComplete]);

  const initializeGame = () => {
    // Normaliza os dados: aceita `term`/`definition` ou `title`/`description`
    const normalizedContent = game.data.map((item) => ({
      term: item.term || item.termo || item.title || 'Termo desconhecido',
      definition: item.definition || item.definição || item.description || 'Definição desconhecida',
      id: item.id || item._id || Math.random().toString(36).substring(2)
    }));

    const gameCards = [];
    normalizedContent.forEach((item) => {
      gameCards.push({
        content: item.term,
        pairId: item.id,
        id: `term-${item.id}`
      });
      gameCards.push({
        content: item.definition,
        pairId: item.id,
        id: `def-${item.id}`
      });
    });

    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMistakes(0);
  };

  const handleCardClick = (card) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.some((c) => c.id === card.id) ||
      matchedPairs.includes(card.id)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairs((prev) => [...prev, firstCard.id, secondCard.id]);
        setScore((prev) => prev + 100);
        setFlippedCards([]);
      } else {
        onMistake();
        setMistakes((prev) => prev + 1);
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const isCardFlipped = (card) => {
    return (
      flippedCards.some((c) => c.id === card.id) ||
      matchedPairs.includes(card.id)
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`aspect-square cursor-pointer flex items-center justify-center p-2 text-center transition-colors ${
              isCardFlipped(card)
                ? 'bg-blue-200'
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => handleCardClick(card)}
          >
            <CardContent className="p-1">
              {isCardFlipped(card) ? (
                <p className="text-sm font-medium text-gray-800">
                  {card.content}
                </p>
              ) : (
                <p className="text-2xl font-bold text-gray-400">?</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center text-gray-600">
        Pares encontrados: {matchedPairs.length / 2} / {cards.length / 2}
      </div>
    </div>
  );
};

export default MemoryGame;
