
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Position } from '../types';

interface EditorProps {
  html: string;
  onChange: (html: string) => void;
  onSelection: (position: Position) => void;
  clearSelection: () => void;
  onShowTooltip: (noteId: string, target: HTMLElement) => void;
  onHideTooltip: () => void;
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(({ html, onChange, onSelection, clearSelection, onShowTooltip, onHideTooltip }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);
  
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [html]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const handleMouseUp = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          onSelection({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
        }
      } else {
        clearSelection();
      }
    }, 10);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && (e.key === 'x' || e.key === 'X' || e.key === 'KeyX')) {
        const selection = window.getSelection();
        if (selection && selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            const parent = container.parentElement;

            if (parent && parent.classList.contains('note-highlight') && range.startOffset === (container.textContent || '').length) {
                e.preventDefault();
                const zeroWidthSpace = document.createTextNode('\u200B');
                const nextSibling = parent.nextSibling;
                
                if (nextSibling) {
                    parent.parentNode?.insertBefore(zeroWidthSpace, nextSibling);
                } else {
                    parent.parentNode?.appendChild(zeroWidthSpace);
                }
                
                const newRange = document.createRange();
                newRange.setStart(zeroWidthSpace, 1);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    }
  };
  
  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    const target = e.target as HTMLElement;
    const noteElement = target.closest('.note-highlight') as HTMLElement | null;
    if (noteElement && noteElement.dataset.noteId) {
      onShowTooltip(noteElement.dataset.noteId, noteElement);
    }
  };
  
  const handleMouseOut = () => {
    tooltipTimeoutRef.current = window.setTimeout(() => {
      onHideTooltip();
    }, 300); // A small delay to allow moving mouse into the tooltip
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="ProseMirror min-h-[400px] w-full bg-gray-900 text-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow text-lg leading-relaxed"
      style={{ whiteSpace: 'pre-wrap' }}
    />
  );
});

Editor.displayName = 'Editor';

export default Editor;
