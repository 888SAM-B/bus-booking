
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Bus } from '../types';
import Card from '../components/common/Card';

const SearchResultsPage: React.FC = () => {
  const [results, setResults] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { findBuses } = useData();
  
  const query = new URLSearchParams(location.search);
  const from = query.get('from');
  const to = query.get('to');
  const date = query.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      if (from && to) {
        setLoading(true);
        try {
          const foundBuses = await findBuses(from, to);
          setResults(foundBuses);
        } catch (error) {
          console.error("Failed to fetch buses:", error);
          // Optionally set an error state to show in the UI
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/');
      }
    };

    fetchBuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  if (!from || !to || !date) {
    navigate('/');
    return null;
  }
  
  if (loading) {
     return <p className="text-center text-gray-600">Searching for buses...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Buses from {from} to {to}</h1>
      <p className="text-gray-600 mb-6">Showing results for {new Date(date).toDateString()}</p>
      
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map(bus => (
            <Card key={bus.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold text-primary-700">{bus.busNumber}</h3>
                  <p className="text-sm text-gray-500">Operated by {bus.ownerName}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div>
                      <p className="font-semibold">{bus.departureTime}</p>
                      <p className="text-sm text-gray-600">{from}</p>
                    </div>
                    <span className="text-gray-400">&rarr;</span>
                    <div>
                      <p className="font-semibold">{bus.arrivalTime}</p>
                      <p className="text-sm text-gray-600">{to}</p>
                    </div>
                  </div>
                </div>
                <div className="text-left md:text-center">
                  <p className="text-lg font-bold text-gray-800">₹{bus.price}</p>
                  <p className="text-sm text-gray-600">per seat</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-semibold mb-1">{bus.capacity - bus.bookedSeats.length} seats available</p>
                  <Link to={`/book/${bus.id}?date=${date}`}>
                    <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-200 w-full md:w-auto">
                      Select Seats
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <h3 className="text-xl font-semibold">No Buses Found</h3>
          <p className="text-gray-600 mt-2">There are no buses available for this route on the selected date. Please try another search.</p>
          <Link to="/">
            <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-200">
              Back to Search
            </button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default SearchResultsPage;
