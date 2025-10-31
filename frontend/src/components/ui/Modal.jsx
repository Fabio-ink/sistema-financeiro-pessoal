import React from 'react';
import Card from './Card';

function Modal({ children, isOpen, onCancel }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={onCancel} // Fecha o modal ao clicar no fundo
    >
      <Card 
        className="w-full max-w-md shadow-2xl border-gray-700"
        onClick={(e) => e.stopPropagation()} // Impede que o clique no card feche o modal
      >
        {children}
      </Card>
    </div>
  );
}

export default Modal;
