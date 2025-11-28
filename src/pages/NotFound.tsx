import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
      <div className="text-center px-6 py-12">
        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 select-none">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <i className="fas fa-search text-6xl text-gray-400" aria-hidden="true"></i>
        </div>

        {/* Oops Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or you don't have permission to access it.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <i className="fas fa-home" aria-hidden="true"></i>
            Go to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <i className="fas fa-arrow-left" aria-hidden="true"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
