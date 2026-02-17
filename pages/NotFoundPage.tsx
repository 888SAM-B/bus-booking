
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link to="/">
        <button className="mt-8 bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition duration-200">
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
