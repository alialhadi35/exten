
import React, { useState } from 'react';
import { Note, Position } from '../types';

interface NoteTooltipProps {
  note: Note;
  position: Position;
  onDelete: (noteId: string) => void;
}

const NoteTooltip: React.FC<NoteTooltipProps> = ({ note, position, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed z-50 bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-4 max-w-sm text-white transition-opacity animate-fade-in"
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
    >
      <div className="max-h-40 overflow-y-auto pr-2 mb-3">
        <p className="text-gray-300 whitespace-pre-wrap">{note.content || 'لا يوجد محتوى لهذه الملاحظة.'}</p>
      </div>
      <div className="flex items-center justify-end space-x-2 border-t border-gray-700 pt-2">
        <button
          onClick={handleCopy}
          className="p-2 text-gray-400 hover:text-teal-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          title={copied ? 'تم النسخ!' : 'نسخ الملاحظة'}
        >
          {copied ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
            </svg>
          )}
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 text-gray-400 hover:text-red-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          title="حذف الملاحظة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NoteTooltip;
