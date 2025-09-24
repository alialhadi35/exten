
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Note, Position } from './types';
import Editor from './components/Editor';
import NotePanel from './components/NotePanel';
import FloatingAddButton from './components/FloatingAddButton';
import NoteTooltip from './components/NoteTooltip';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [editorHtml, setEditorHtml] = useState<string>('<p>ابدأ الكتابة هنا...</p>');
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isNotePanelOpen, setIsNotePanelOpen] = useState<boolean>(false);
  
  const [addButtonPosition, setAddButtonPosition] = useState<Position | null>(null);
  const [tooltipState, setTooltipState] = useState<{ position: Position; noteId: string } | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('arabic-editor-notes');
    const savedContent = localStorage.getItem('arabic-editor-content');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedContent) {
      setEditorHtml(savedContent);
    }
  }, []);

  const saveContent = (html: string) => {
    setEditorHtml(html);
    localStorage.setItem('arabic-editor-content', html);
  };
  
  const saveNotes = (newNotes: Record<string, Note>) => {
    setNotes(newNotes);
    localStorage.setItem('arabic-editor-notes', JSON.stringify(newNotes));
  };
  
  const handleSelection = useCallback((position: Position) => {
    setAddButtonPosition(position);
  }, []);
  
  const clearSelection = useCallback(() => {
    setAddButtonPosition(null);
  }, []);

  const handleAddNoteClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const noteId = `note-${Date.now()}`;
    const newNote: Note = { id: noteId, content: '' };
    
    const span = document.createElement('span');
    span.className = 'note-highlight';
    span.dataset.noteId = noteId;
    
    try {
        range.surroundContents(span);
    } catch(e) {
        console.error("Could not surround contents, possibly crossing element boundaries.", e);
        return;
    }

    const newNotes = { ...notes, [noteId]: newNote };
    saveNotes(newNotes);
    
    if (editorRef.current) {
      saveContent(editorRef.current.innerHTML);
    }
    
    setActiveNoteId(noteId);
    setIsNotePanelOpen(true);
    setAddButtonPosition(null);
    selection.removeAllRanges();
  };

  const handleNoteUpdate = (noteId: string, content: string) => {
    const updatedNotes = { ...notes, [noteId]: { ...notes[noteId], content } };
    saveNotes(updatedNotes);
  };
  
  const handleNoteDelete = (noteId: string) => {
    if (!editorRef.current) return;
    
    // Remove note from state
    const newNotes = { ...notes };
    delete newNotes[noteId];
    saveNotes(newNotes);

    // Remove highlight from DOM
    const highlightedElements = editorRef.current.querySelectorAll(`[data-note-id="${noteId}"]`);
    highlightedElements.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
        parent.normalize(); // Merges adjacent text nodes
      }
    });
    
    saveContent(editorRef.current.innerHTML);
    setTooltipState(null);
    if(activeNoteId === noteId) {
        setIsNotePanelOpen(false);
        setActiveNoteId(null);
    }
  };

  const showTooltip = (noteId: string, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setTooltipState({
      noteId,
      position: { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX },
    });
  };

  const hideTooltip = () => {
    setTooltipState(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex transition-all duration-300 ease-in-out" dir="rtl">
      <main className={`flex-grow p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out ${isNotePanelOpen ? 'md:mr-96' : ''}`}>
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-4">
          <header className="mb-6 border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-bold text-teal-400">محرر المستندات العربي</h1>
            <p className="text-gray-400 mt-2">حدد نصًا لإضافة ملاحظة، أو مرر فوق نص مميز لعرضها.</p>
          </header>
          <Editor
            ref={editorRef}
            html={editorHtml}
            onChange={saveContent}
            onSelection={handleSelection}
            clearSelection={clearSelection}
            onShowTooltip={showTooltip}
            onHideTooltip={hideTooltip}
          />
        </div>
        {notes && Object.keys(notes).length > 0 && (
            <div className="max-w-4xl mx-auto mt-8 bg-gray-800 rounded-lg shadow-2xl p-6">
                 <h2 className="text-2xl font-bold text-teal-400 mb-4">جميع الملاحظات</h2>
                 <ul className="space-y-4">
                     {/* FIX: Explicitly type `note` as `Note` to resolve TypeScript error where it was inferred as `unknown`. */}
                     {Object.values(notes).map((note: Note) => (
                         <li key={note.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-start">
                             <p className="text-gray-300 flex-grow pr-4">{note.content || 'ملاحظة فارغة...'}</p>
                             <button onClick={() => handleNoteDelete(note.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                             </button>
                         </li>
                     ))}
                 </ul>
            </div>
        )}
      </main>

      <NotePanel
        isOpen={isNotePanelOpen}
        note={activeNoteId ? notes[activeNoteId] : null}
        onClose={() => { setIsNotePanelOpen(false); setActiveNoteId(null);}}
        onUpdate={handleNoteUpdate}
        onDelete={handleNoteDelete}
      />

      {addButtonPosition && <FloatingAddButton position={addButtonPosition} onClick={handleAddNoteClick} />}
      
      {tooltipState && (
        <NoteTooltip 
          note={notes[tooltipState.noteId]}
          position={tooltipState.position}
          onDelete={handleNoteDelete}
        />
      )}
    </div>
  );
};

export default App;
