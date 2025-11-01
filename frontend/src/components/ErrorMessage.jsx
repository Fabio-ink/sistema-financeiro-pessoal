import React from 'react';
import Card from './ui/Card';

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <Card className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </Card>
  );
}

export default ErrorMessage;
