import React from 'react';

function PageTitle({ children }) {
  return (
    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {children}
    </h1>
  );
}

export default PageTitle;
