import React from 'react';
const NotFoundPage = ({ message = "The page you requested could not be found." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4 text-center">404</h1>
      <p className="text-xl text-gray-300 mb-8 text-center max-w-lg">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <a
          href="/"
          className="w-full sm:w-auto
                     bg-gray-900 hover:bg-gray-800 text-white font-semibold
                     py-3 px-6 rounded-lg transition duration-300 shadow-lg
                     text-center border-2 border-green-700 hover:border-green-600"
        >
          Go to Homepage
        </a>
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto
                     bg-gray-900 hover:bg-gray-800 text-white font-semibold
                     py-3 px-6 rounded-lg transition duration-300 shadow-lg
                     text-center border-2 border-green-700 hover:border-green-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
