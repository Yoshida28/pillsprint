import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-primary-300">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            to="/"
            className="btn-primary flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Search for Medicines</h2>
          <div className="flex items-center bg-white rounded-full shadow-sm p-1">
            <Search className="h-5 w-5 text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search for medicines..."
              className="flex-1 py-2 px-3 focus:outline-none"
            />
            <button className="btn-primary !py-2 !px-4 rounded-full">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;