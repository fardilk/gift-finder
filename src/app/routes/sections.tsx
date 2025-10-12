import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

export function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen p-8">
            <h1 className="text-3xl font-bold">Gift Finder</h1>
            <p className="mt-4 text-gray-600">Welcome!</p>
            <Link className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded" to="/about">
              About
            </Link>
          </div>
        }
      />
      <Route path="/about" element={<div className="p-8">About page</div>} />
    </Routes>
  );
}
