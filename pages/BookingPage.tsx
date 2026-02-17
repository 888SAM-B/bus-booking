import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Bus } from '../types';
import RouteMap from '../components/common/RouteMap';

const Seat: React.FC<{ seatNumber: string; isBooked: boolean; isSelected: boolean; onSelect: (seat: string) => void; }> = ({ seatNumber, isBooked, isSelected, onSelect }) => {
  let seatClass = 'seat';
  if (isBooked) seatClass += ' seat-booked';
  else if (isSelected) seatClass += ' seat-selected';
  else seatClass += ' seat-available';

  return (
    <div className={seatClass} onClick={() => !isBooked && onSelect(seatNumber)}>
      {seatNumber}
    </div>
  );
};

const BookingPage: React.FC = () => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getBusById, createBooking, routes } = useData();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const query = new URLSearchParams(location.search);
  const dateFromQuery = query.get('date');

  useEffect(() => {
    const fetchBus = async () => {
      if (busId) {
        setLoading(true);
        try {
          const busData = await getBusById(busId);
          setBus(busData || null);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBus();
  }, [busId, getBusById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Bus Not Found</h2>
        <button onClick={() => navigate('/search-buses')} className="btn btn-primary">Go Back Search</button>
      </div>
    );
  }

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    setIsBooking(true);
    try {
      const bookingDetails = await createBooking(bus.id, selectedSeats);
      if (bookingDetails) {
        const payload = { booking: bookingDetails, bus: bus, date: dateFromQuery };
        sessionStorage.setItem('lastBooking', JSON.stringify(payload));
        navigate('/confirmation', { state: payload });
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const busRoute = routes.find(r => r.id === bus.routeId);
  const seatLayout = Array.from({ length: Math.ceil(bus.capacity / 4) }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600">Review details and select your preferred seats</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            ← Back to Results
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Seat Selection & Map */}
          <div className="lg:col-span-8 space-y-8">
            {/* Seat Selection Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Select Seats</h2>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center"><div className="w-4 h-4 rounded bg-green-500 mr-2"></div> Available</div>
                  <div className="flex items-center"><div className="w-4 h-4 rounded bg-blue-600 mr-2"></div> Selected</div>
                  <div className="flex items-center"><div className="w-4 h-4 rounded bg-gray-300 mr-2"></div> Booked</div>
                </div>
              </div>

              <div className="bg-gray-100 p-8 rounded-2xl max-w-md mx-auto relative">
                {/* Steering Wheel Indicator */}
                <div className="absolute top-4 right-8 text-4xl opacity-20">⭕</div>

                <div className="grid grid-cols-5 gap-3">
                  {seatLayout.flatMap(row =>
                    [1, 2, 'aisle', 3, 4].map((col, index) =>
                      col === 'aisle' ? <div key={`${row}-aisle`} className="w-8" /> : (
                        <Seat
                          key={`${row}${col}`}
                          seatNumber={`${row}${col}`}
                          isBooked={bus.bookedSeats.includes(`${row}${col}`)}
                          isSelected={selectedSeats.includes(`${row}${col}`)}
                          onSelect={toggleSeat}
                        />
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Route Map Card */}
            {busRoute && (
              <RouteMap
                from={busRoute.from}
                to={busRoute.to}
                stops={bus.stops}
                departureTime={bus.departureTime}
                arrivalTime={bus.arrivalTime}
              />
            )}
          </div>

          {/* Sidebar: Booking Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="card card-premium shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Booking Summary</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Bus Number</span>
                    <span className="text-gray-900 font-bold">{bus.busNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Route</span>
                    <span className="text-gray-900 font-bold">{busRoute?.from} → {busRoute?.to}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Date</span>
                    <span className="text-gray-900 font-bold">{dateFromQuery ? new Date(dateFromQuery).toDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Time</span>
                    <span className="text-gray-900 font-bold">{bus.departureTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Bus Type</span>
                    <span className="badge badge-primary">{bus.busType || 'Standard'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-gray-500 font-medium block">Selected Seats</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSeats.length > 0 ? (
                          selectedSeats.map(s => <span key={s} className="badge badge-primary">{s}</span>)
                        ) : (
                          <span className="text-gray-400 italic">No seats selected</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 font-medium block">Price per seat</span>
                      <span className="text-xl font-bold text-gray-900">₹{bus.price}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900 text-white rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100 font-medium">Total Amount</span>
                    <span className="text-3xl font-bold">₹{bus.price * selectedSeats.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0 || isBooking}
                  className="btn btn-accent w-full py-4 text-lg disabled:opacity-50"
                >
                  {isBooking ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-2" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                      Processing...
                    </div>
                  ) : (
                    'Confirm'
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  By clicking "Confirm", you agree to our Terms of Service.
                </p>
              </div>

              {/* Extra Info Card */}
              <div className="card bg-orange-50 border-orange-100">
                <h4 className="font-bold text-orange-800 mb-2">Need Help?</h4>
                <p className="text-sm text-orange-700">Contact our 24/7 support line at 1800-123-4567 for any assistance with your booking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
