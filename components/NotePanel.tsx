
import React, { useEffect, useState } from 'react';
import { Note } from '../types';

interface NotePanelProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onUpdate: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
}

const NotePanel: React.FC<NotePanelProps> = ({ isOpen, note, onClose, onUpdate, onDelete }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(note?.content || '');
  }, [note]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (note) {
      onUpdate(note.id, e.target.value);
    }
  };
  
  const handleDelete = () => {
    if (note) {
        onDelete(note.id);
        onClose();
    }
  };

  if (!note) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-96 bg-gray-800 shadow-2xl z-40 p-6 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'transform-none' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-400">تحرير الملاحظة</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="اكتب ملاحظتك هنا..."
          className="flex-grow w-full bg-gray-900 text-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-lg"
          autoFocus
        />
        <div className="mt-6 flex justify-end">
            <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                حذف الملاحظة
            </button>
        </div>
      </div>
    </>
  );
};

export default NotePanel;
