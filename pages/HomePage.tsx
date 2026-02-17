
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const HomePage: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();
  const { routes } = useData();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      navigate(`/search?from=${from}&to=${to}&date=${date}`);
    } else {
      alert('Please fill in all fields.');
    }
  };

  const uniqueFrom = [...new Set(routes.map(r => r.from))];
  const uniqueTo = [...new Set(routes.map(r => r.to))];

  return (
    <div>
      <div className="relative bg-primary-600 rounded-lg text-white p-12 text-center overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Find Your Next Bus Trip</h1>
          <p className="text-xl">Easy, Fast, and Reliable Booking</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg -mt-16 relative z-20">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="flex flex-col">
            <label htmlFor="from" className="font-semibold mb-2 text-gray-700">From</label>
            <select
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-black"
            >
              <option value="">Select Origin</option>
              {uniqueFrom.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="to" className="font-semibold mb-2 text-gray-700">To</label>
            <select
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-black"
            >
              <option value="">Select Destination</option>
              {uniqueTo.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="date" className="font-semibold mb-2 text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white p-3 rounded-lg font-bold hover:bg-primary-700 transition duration-200 col-span-1">
            Search Buses
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;