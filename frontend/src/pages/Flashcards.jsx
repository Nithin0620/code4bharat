import { useState } from 'react';
import { CreditCard, Plus, Edit, Trash2, RotateCw } from 'lucide-react';

const Flashcards = () => {
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const flashcardSets = [
    {
      id: 1,
      title: 'Math Formulas',
      subject: 'Mathematics',
      cards: [
        { id: 1, question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b²-4ac)) / 2a' },
        { id: 2, question: 'What is the Pythagorean theorem?', answer: 'a² + b² = c²' },
        { id: 3, question: 'What is the slope formula?', answer: 'm = (y₂-y₁)/(x₂-x₁)' }
      ],
      created: '2 days ago'
    },
    {
      id: 2,
      title: 'Chemistry Elements',
      subject: 'Chemistry',
      cards: [
        { id: 1, question: 'What is the symbol for Gold?', answer: 'Au' },
        { id: 2, question: 'What is the atomic number of Carbon?', answer: '6' },
        { id: 3, question: 'What is the formula for water?', answer: 'H₂O' }
      ],
      created: '1 week ago'
    },
    {
      id: 3,
      title: 'Historical Dates',
      subject: 'History',
      cards: [
        { id: 1, question: 'When did World War II end?', answer: '1945' },
        { id: 2, question: 'When was the Declaration of Independence signed?', answer: '1776' },
        { id: 3, question: 'When did the Berlin Wall fall?', answer: '1989' }
      ],
      created: '3 days ago'
    }
  ];

  const handleCardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextCard = () => {
    if (selectedSet && currentCard < selectedSet.cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const handleSetSelect = (set) => {
    setSelectedSet(set);
    setCurrentCard(0);
    setShowAnswer(false);
  };

  if (selectedSet) {
    const card = selectedSet.cards[currentCard];
    
    return (
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <button
            onClick={() => setSelectedSet(null)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Sets
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{selectedSet.title}</h1>
          <p className="text-gray-600 mt-2">
            Card {currentCard + 1} of {selectedSet.cards.length}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 min-h-96 flex flex-col justify-center">
            <div className="text-center">
              <div className="mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {showAnswer ? 'Answer' : 'Question'}
                </h2>
              </div>
              
              <div className="text-lg text-gray-700 mb-8">
                {showAnswer ? card.answer : card.question}
              </div>
              
              <button
                onClick={handleCardFlip}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <RotateCw className="h-5 w-5" />
                <span>Flip Card</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevCard}
              disabled={currentCard === 0}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {selectedSet.cards.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentCard ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNextCard}
              disabled={currentCard === selectedSet.cards.length - 1}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Flashcards</h1>
        <p className="text-gray-600 mt-2">Create and study with digital flashcards</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Set</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {flashcardSets.map((set) => (
          <div key={set.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-gray-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{set.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{set.subject}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{set.cards.length} cards</span>
              <span>Created {set.created}</span>
            </div>
            
            <button
              onClick={() => handleSetSelect(set)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Study Set
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;