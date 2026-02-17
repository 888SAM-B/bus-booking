import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Bus, Route } from '../types';

const SearchBusesPage: React.FC = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
    const [userBookings, setUserBookings] = useState<any[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const navigate = useNavigate();
    const { routes, findBuses, getUserBookings } = useData();
    const { user } = useAuth();

    // Get unique cities for source
    const uniqueFrom = [...new Set(routes.map(r => r.from))].sort();

    // Get available destinations based on selected source
    const availableDestinations = from
        ? [...new Set(routes.filter(r => r.from === from).map(r => r.to))].sort()
        : [];

    // Reset destination when source changes
    useEffect(() => {
        if (from && to && from === to) {
            setTo('');
        }
    }, [from]);

    const fetchUserBookings = async () => {
        setIsLoadingBookings(true);
        try {
            const data = await getUserBookings();
            setUserBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'bookings') {
            fetchUserBookings();
        }
    }, [activeTab]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!from || !to || !date) {
            alert('Please fill in all fields');
            return;
        }

        if (from === to) {
            alert('Source and destination cannot be the same');
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            const results = await findBuses(from, to);
            setBuses(results);
        } catch (error) {
            console.error('Search error:', error);
            alert('Failed to search buses. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleBookNow = (busId: string) => {
        navigate(`/book/${busId}?date=${date}`);
    };

    const getRouteInfo = (routeId: string) => {
        return routes.find(r => r.id === routeId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8 shadow-lg">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Bus Ticket</h1>
                            <p className="text-blue-100">Welcome, {user?.name}! Find the perfect bus for your journey</p>
                        </div>

                        <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20">
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'search' ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/5'}`}
                            >
                                Search
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/5'}`}
                            >
                                My Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                {activeTab === 'search' ? (
                    <>
                        {/* Search Form */}
                        <div className="card card-premium p-8 mb-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search Buses
                            </h2>

                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <label htmlFor="from" className="block text-sm font-semibold text-gray-700 mb-2">
                                        From (Source)
                                    </label>
                                    <select
                                        id="from"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="select"
                                        required
                                    >
                                        <option value="">Select Source City</option>
                                        {uniqueFrom.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-2">
                                        To (Destination)
                                    </label>
                                    <select
                                        id="to"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="select"
                                        required
                                        disabled={!from}
                                    >
                                        <option value="">Select Destination City</option>
                                        {availableDestinations.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    {!from && (
                                        <p className="mt-1 text-xs text-gray-500">Please select source first</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Journey Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={isSearching || !from || !to}
                                        className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSearching ? (
                                            <div className="flex items-center justify-center">
                                                <div className="spinner mr-2" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                                Searching...
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                Search Buses
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Search Results */}
                        {hasSearched && (
                            <div className="animate-fadeIn">
                                {buses.length > 0 ? (
                                    <>
                                        <div className="mb-6 flex items-center justify-between">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {buses.length} {buses.length === 1 ? 'Bus' : 'Buses'} Found
                                            </h2>
                                            <div className="text-sm text-gray-600">
                                                {from} → {to} on {new Date(date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            {buses.map((bus, index) => {
                                                const route = getRouteInfo(bus.routeId);
                                                const availableSeats = bus.capacity - bus.bookedSeats.length;
                                                const utilizationPercent = ((bus.bookedSeats.length / bus.capacity) * 100).toFixed(0);

                                                return (
                                                    <div
                                                        key={bus.id}
                                                        className="card p-6 hover:shadow-2xl transition-all duration-300 animate-fadeIn"
                                                        style={{ animationDelay: `${index * 100}ms` }}
                                                    >
                                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                            {/* Bus Info */}
                                                            <div className="lg:col-span-8">
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div>
                                                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{bus.busNumber}</h3>
                                                                        <p className="text-gray-600">{bus.ownerName}</p>
                                                                        {bus.busType && (
                                                                            <span className="badge badge-primary mt-2">{bus.busType}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-3xl font-bold text-blue-600">₹{bus.price}</div>
                                                                        <div className="text-sm text-gray-500">per seat</div>
                                                                    </div>
                                                                </div>

                                                                {/* Journey Details */}
                                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                                    <div className="flex items-center">
                                                                        <div className="bg-blue-100 p-3 rounded-lg mr-3">
                                                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm text-gray-500">Departure</div>
                                                                            <div className="font-semibold text-gray-900">{bus.departureTime}</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center">
                                                                        <div className="bg-green-100 p-3 rounded-lg mr-3">
                                                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm text-gray-500">Arrival</div>
                                                                            <div className="font-semibold text-gray-900">{bus.arrivalTime}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Amenities */}
                                                                {bus.amenities && bus.amenities.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                                        {bus.amenities.map((amenity, i) => (
                                                                            <span key={i} className="badge badge-success">{amenity}</span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Stops Info */}
                                                                {bus.stops && bus.stops.length > 0 && (
                                                                    <div className="mt-4">
                                                                        <button
                                                                            onClick={() => {
                                                                                const el = document.getElementById(`stops-${bus.id}`);
                                                                                if (el) el.classList.toggle('hidden');
                                                                            }}
                                                                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                            </svg>
                                                                            View {bus.stops.length} Stops
                                                                        </button>
                                                                        <div id={`stops-${bus.id}`} className="hidden mt-3 p-4 bg-gray-50 rounded-lg">
                                                                            <div className="space-y-2">
                                                                                {bus.stops.map((stop, i) => (
                                                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                                                        <div className="flex items-center">
                                                                                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                                                                            <span className="font-semibold text-gray-900">{stop.stopName}</span>
                                                                                        </div>
                                                                                        <div className="text-gray-600">
                                                                                            {stop.arrivalTime} - {stop.departureTime}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Booking Section */}
                                                            <div className="lg:col-span-4 flex flex-col justify-between border-l-0 lg:border-l-2 border-gray-200 lg:pl-6">
                                                                <div>
                                                                    <div className="mb-4">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-sm font-semibold text-gray-700">Available Seats</span>
                                                                            <span className="text-2xl font-bold text-green-600">{availableSeats}</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                                                style={{ width: `${100 - parseInt(utilizationPercent)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {utilizationPercent}% booked
                                                                        </div>
                                                                    </div>

                                                                    {bus.hoursOfTravel && (
                                                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                                            <div className="text-sm text-gray-600">Journey Duration</div>
                                                                            <div className="text-lg font-bold text-blue-600">
                                                                                {bus.hoursOfTravel} hours
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    onClick={() => handleBookNow(bus.id)}
                                                                    disabled={availableSeats === 0}
                                                                    className="btn btn-accent w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {availableSeats === 0 ? 'Fully Booked' : 'Book Now'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="card p-12 text-center">
                                        <div className="text-6xl mb-4">😔</div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Buses Found</h3>
                                        <p className="text-gray-600 mb-6">
                                            Sorry, we couldn't find any buses for your search criteria.
                                            <br />
                                            Try searching for a different route or date.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setHasSearched(false);
                                                setBuses([]);
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Search Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Initial State */}
                        {!hasSearched && (
                            <div className="card p-12 text-center animate-fadeIn">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Search</h3>
                                <p className="text-gray-600">
                                    Select your source, destination, and travel date to find available buses
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="animate-fadeIn">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Bookings</h2>

                        {isLoadingBookings ? (
                            <div className="p-20 text-center"><div className="spinner"></div></div>
                        ) : userBookings.length === 0 ? (
                            <div className="card p-12 text-center">
                                <div className="text-6xl mb-4">🎫</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
                                <p className="text-gray-600 mb-6">You haven't booked any tickets yet. Start your journey by searching for buses!</p>
                                <button onClick={() => setActiveTab('search')} className="btn btn-primary">Search Buses</button>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {userBookings.map((bk, index) => (
                                    <div key={bk.id} className="card p-8 hover:shadow-xl transition-all animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="badge badge-success px-4 py-1">{bk.status || 'CONFIRMED'}</span>
                                                    <span className="text-sm text-gray-500 font-medium">Booked on {new Date(bk.bookingDate).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-3xl font-black text-gray-900 mb-2">{bk.bus?.busNumber || 'Bus Details Loading...'}</h3>
                                                <div className="text-xl text-blue-600 font-bold mb-4">{bk.bus?.ownerName}</div>

                                                <div className="grid grid-cols-2 gap-8 mt-6">
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Seats</div>
                                                        <div className="text-lg font-bold text-gray-800">{bk.seats.join(", ")}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount Paid</div>
                                                        <div className="text-lg font-bold text-green-600">₹{bk.totalPrice}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                                                <div className="text-center md:text-right mb-6">
                                                    <div className="text-sm text-gray-500 font-medium italic">Departure</div>
                                                    <div className="text-2xl font-black text-gray-900">{bk.bus?.departureTime || '--:--'}</div>
                                                </div>
                                                <button className="btn btn-outline w-full md:w-auto">Download Ticket</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBusesPage;
