import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>Bus Booking System.</p>
        <a href="https://bsamportfolio.netlify.app" target="_blank" >
          <p className="text-sm text-gray-400 mt-2">B Sam</p>
        </a>
      </div>
    </footer>
  );
};

export default Footer;