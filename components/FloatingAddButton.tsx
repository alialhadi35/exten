
import React from 'react';
import { Position } from '../types';

interface FloatingAddButtonProps {
  position: Position;
  onClick: () => void;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ position, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed z-20 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-400 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
      style={{ top: `${position.top}px`, left: `${position.left + 5}px`, transform: 'translateY(-50%)' }}
      title="إضافة ملاحظة"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

export default FloatingAddButton;
