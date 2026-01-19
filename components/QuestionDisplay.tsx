
import React, { useState } from 'react';
import { QuestionData } from '../types';
import { Button } from './Button';

interface QuestionDisplayProps {
  data: QuestionData;
  onReset: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ data, onReset }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionClick = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    setShowExplanation(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-50">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">سؤال جديد</span>
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed mt-2">{data.question}</h2>
        </div>
        
        <div className="p-8 space-y-3">
          {data.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrect = idx === data.correctIndex;
            let bgColor = "bg-gray-50 hover:bg-gray-100 border-transparent";
            let textColor = "text-gray-700";

            if (selectedIndex !== null) {
              if (isCorrect) {
                bgColor = "bg-green-100 border-green-500";
                textColor = "text-green-800 font-bold";
              } else if (isSelected && !isCorrect) {
                bgColor = "bg-red-100 border-red-500";
                textColor = "text-red-800 font-bold";
              } else {
                bgColor = "bg-gray-50 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedIndex !== null}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-right p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${bgColor} ${textColor}`}
              >
                <span className="text-lg">{option}</span>
                {selectedIndex !== null && isCorrect && (
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {selectedIndex !== null && isSelected && !isCorrect && (
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="p-8 bg-blue-50 border-t border-blue-100 animate-in fade-in zoom-in-95 duration-300">
            <h4 className="font-bold text-blue-800 mb-2">التفسير:</h4>
            <p className="text-blue-900 leading-relaxed">{data.explanation}</p>
          </div>
        )}

        <div className="p-8 flex justify-center border-t border-gray-50">
          <Button variant="secondary" onClick={onReset}>
            ابدأ من جديد
          </Button>
        </div>
      </div>
    </div>
  );
};
