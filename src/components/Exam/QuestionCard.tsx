import React, { useState } from 'react';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  answer,
  onAnswerChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    answer as string | undefined
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    (answer as string) || ''
  );

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onAnswerChange(option);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAnswer(e.target.value);
    onAnswerChange(e.target.value);
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-800 shadow-xl p-6 mb-6">
      <div className="flex items-start mb-4">
        <span className="bg-indigo-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
          {questionNumber}
        </span>
        <h3 className="text-lg font-medium text-white">{question.text}</h3>
      </div>

      <div className="ml-11">
        {question.type === 'mcq' && question.options ? (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`question-${question.id}-option-${index}`}
                  name={`question-${question.id}`}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 bg-gray-800 border-gray-700 focus:ring-offset-gray-900"
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelect(option)}
                />
                <label
                  htmlFor={`question-${question.id}-option-${index}`}
                  className="ml-3 block text-gray-300"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <textarea
              rows={6}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your answer here..."
              value={textAnswer}
              onChange={handleTextChange}
            ></textarea>
          </div>
        )}
      </div>

      <div className="mt-4 text-right text-sm text-gray-400">
        {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
      </div>
    </div>
  );
};

export default QuestionCard;