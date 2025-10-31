import React from 'react';

function Modal({ children, isOpen, onCancel }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onCancel}
    >
      <div 
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;