
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

const AssociationGame = ({ game, onComplete, onMistake }) => {
  const [terms, setTerms] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    initializeGame();
  }, [game]);

  useEffect(() => {
    if (matches.length === game.content.length) {
      onComplete(score, mistakes);
    }
  }, [matches]);

  const initializeGame = () => {
    const shuffledTerms = [...game.content].sort(() => Math.random() - 0.5);
    const shuffledDefinitions = [...game.content].sort(() => Math.random() - 0.5);
    
    setTerms(shuffledTerms);
    setDefinitions(shuffledDefinitions);
    setMatches([]);
    setScore(0);
    setMistakes(0);
  };

  const checkMatch = (term, definition) => {
    if (term.id === definition.id) {
      setMatches(prev => [...prev, { termId: term.id, definitionId: definition.id }]);
      setScore(prev => prev + 100);
      setFeedback({ type: 'success', message: 'Correto!' });
    } else {
      setMistakes(prev => prev + 1);
      onMistake();
      setFeedback({ type: 'error', message: 'Incorreto!' });
    }
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setTimeout(() => setFeedback(null), 1500);
  };

  const handleTermClick = (term) => {
    if (matches.some(m => m.termId === term.id)) return;
    setSelectedTerm(term);
    if (selectedDefinition) checkMatch(term, selectedDefinition);
  };

  const handleDefinitionClick = (definition) => {
    if (matches.some(m => m.definitionId === definition.id)) return;
    setSelectedDefinition(definition);
    if (selectedTerm) checkMatch(selectedTerm, definition);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {feedback && (
        <div className={`text-center mb-4 p-3 rounded-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-semibold">{feedback.message}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">Termos</h3>
          <div className="space-y-3">
            {terms.map((term) => (
              <Card
                key={term.id}
                onClick={() => handleTermClick(term)}
                className={`cursor-pointer transition-all ${matches.some(m => m.termId === term.id) ? 'bg-gray-200 opacity-50' : 'bg-white'} ${selectedTerm?.id === term.id ? 'border-blue-500 border-2' : ''}`}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <p className="font-medium">{term.term}</p>
                  {matches.some(m => m.termId === term.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">Definições</h3>
          <div className="space-y-3">
            {definitions.map((def) => (
              <Card
                key={def.id}
                onClick={() => handleDefinitionClick(def)}
                className={`cursor-pointer transition-all ${matches.some(m => m.definitionId === def.id) ? 'bg-gray-200 opacity-50' : 'bg-white'} ${selectedDefinition?.id === def.id ? 'border-blue-500 border-2' : ''}`}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <p className="text-sm">{def.definition}</p>
                  {matches.some(m => m.definitionId === def.id) && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationGame;
