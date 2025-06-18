// src/components/NotFoundPage.jsx
import React from 'react';

const NotFoundPage = ({ message = "The resource you requested could not be found." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8 text-center">{message}</p>
      <div className="flex space-x-4">
        <a 
          href="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
        >
          Go to Homepage
        </a>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;