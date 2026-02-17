import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Try state first
    if (location.state && (location.state as any).booking) {
      setBookingData(location.state);
    } else {
      // Try session storage
      const stored = sessionStorage.getItem('lastBooking');
      if (stored) {
        try {
          setBookingData(JSON.parse(stored));
        } catch (e) {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [location.state, navigate]);

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const { booking, bus, date } = bookingData;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto animate-fadeIn">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
            ✓
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Your ticket is ready. We've sent the details to <strong>{user?.email}</strong></p>
        </div>

        {/* Ticket Card */}
        <div className="card-premium shadow-2xl overflow-hidden mb-12">
          {/* Ticket Top */}
          <div className="bg-blue-900 text-white p-8 relative">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-blue-300 text-sm uppercase tracking-widest mb-1">Bus Number</div>
                <div className="text-3xl font-bold">{bus.busNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-300 text-sm uppercase tracking-widest mb-1">Booking ID</div>
                <div className="text-xl font-mono">#{booking.id?.slice(-8).toUpperCase() || 'BUS-78X2'}</div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/10 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-center flex-1">
                <div className="text-blue-200 text-xs uppercase mb-1">From</div>
                <div className="text-2xl font-bold">{bus.stops && bus.stops[0]?.stopName || 'Source'}</div>
                <div className="text-sm font-medium">{bus.departureTime}</div>
              </div>
              <div className="px-6 flex flex-col items-center">
                <div className="w-16 h-px bg-blue-400 mb-2 invisible sm:visible"></div>
                <div className="text-2xl">🚌</div>
                <div className="w-16 h-px bg-blue-400 mt-2 invisible sm:visible"></div>
              </div>
              <div className="text-center flex-1">
                <div className="text-blue-200 text-xs uppercase mb-1">To</div>
                <div className="text-2xl font-bold">{bus.stops && bus.stops[bus.stops.length - 1]?.stopName || 'Destination'}</div>
                <div className="text-sm font-medium">{bus.arrivalTime}</div>
              </div>
            </div>
          </div>

          {/* Ticket Bottom */}
          <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8 border-t-2 border-dashed border-gray-200 relative">
            {/* Cut-out circles for ticket effect */}
            <div className="absolute -left-3 top-[-12px] w-6 h-6 bg-gray-50 rounded-full"></div>
            <div className="absolute -right-3 top-[-12px] w-6 h-6 bg-gray-50 rounded-full"></div>

            <div className="space-y-6">
              <div>
                <span className="text-gray-500 text-sm block mb-1">Passenger Name</span>
                <span className="text-lg font-bold text-gray-900">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 text-sm block mb-1">Travel Date</span>
                <span className="text-lg font-bold text-gray-900">{date ? new Date(date).toDateString() : 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 text-sm block mb-1">Seat Numbers</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.seats.map((s: string) => (
                    <span key={s} className="badge badge-primary text-md px-3">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm block mb-1">Bus Type</span>
                  <span className="font-semibold">{bus.busType || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm block mb-1">Status</span>
                  <span className="badge badge-success">Confirmed</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 text-sm block">Total Paid</span>
                  <span className="text-2xl font-bold text-blue-600">₹{booking.totalPrice}</span>
                </div>
                {/* Mock QR Code */}
                <div className="w-16 h-16 bg-white border-2 border-gray-900 p-1">
                  <div className="w-full h-full bg-black opacity-80" style={{ backgroundImage: 'linear-gradient(45deg, white 25%, black 25%, black 50%, white 50%, white 75%, black 75%, black 100%)', backgroundSize: '4px 4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => window.print()} className="btn btn-primary flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
          <button onClick={() => navigate('/search-buses')} className="btn btn-outline flex items-center justify-center">
            Book Another Ticket
          </button>
          <Link to="/" className="btn btn-outline flex items-center justify-center border-gray-300 text-gray-600 hover:bg-gray-100">
            Back to Home
          </Link>
        </div>

        <p className="mt-12 text-center text-gray-500 text-sm">
          Please arrive at the boarding point at least 15 minutes before the departure time.
          <br />Don't forget to carry a valid ID proof during travel.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;