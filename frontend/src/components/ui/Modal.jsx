import React from 'react';
import Card from './Card';

function Modal({ children, isOpen, onCancel }) {
  if (!isOpen) return null;

  return (
    // Overlay
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onCancel}
    >
      {/* Conteúdo do Modal (agora é um Card) */}
      <Card 
        className="w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Card>
    </div>
  );
}

export default Modal;