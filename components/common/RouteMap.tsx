import React from 'react';
import { BusStop } from '../types';

interface RouteMapProps {
    from: string;
    to: string;
    stops?: BusStop[];
    departureTime?: string;
    arrivalTime?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ from, to, stops = [], departureTime, arrivalTime }) => {
    // Calculate total distance (mock calculation)
    const totalDistance = stops.length > 0
        ? stops[stops.length - 1].distanceFromSource
        : 250; // Default 250km

    return (
        <div className="card p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
                <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Route Map
            </h3>

            {/* Map Placeholder */}
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 mb-6 min-h-[400px] overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 20h40M20 0v40\' stroke=\'%23000\' stroke-width=\'0.5\' opacity=\'.2\'/%3E%3C/svg%3E")'
                }}></div>

                {/* Route Visualization */}
                <div className="relative z-10">
                    {/* Source */}
                    <div className="flex items-start mb-8">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-6 flex-1">
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="text-sm text-gray-500 mb-1">Starting Point</div>
                                <div className="text-2xl font-bold text-gray-900">{from}</div>
                                {departureTime && (
                                    <div className="text-sm text-blue-600 mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Departure: {departureTime}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stops */}
                    {stops.map((stop, index) => (
                        <div key={index} className="flex items-start mb-8 ml-8">
                            <div className="flex-shrink-0 relative">
                                <div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-blue-300"></div>
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md relative z-10">
                                    <span className="text-white font-bold">{index + 1}</span>
                                </div>
                            </div>
                            <div className="ml-6 flex-1">
                                <div className="bg-white rounded-lg p-4 shadow-md">
                                    <div className="font-bold text-lg text-gray-900">{stop.stopName}</div>
                                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Arrival:</span>
                                            <span className="ml-2 font-semibold text-gray-900">{stop.arrivalTime}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Departure:</span>
                                            <span className="ml-2 font-semibold text-gray-900">{stop.departureTime}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-blue-600">
                                        📍 {stop.distanceFromSource} km from source
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Connecting Line */}
                    {stops.length > 0 && (
                        <div className="ml-8 mb-8">
                            <div className="w-0.5 h-12 bg-blue-300 ml-6"></div>
                        </div>
                    )}

                    {/* Destination */}
                    <div className="flex items-start ml-8">
                        <div className="flex-shrink-0 relative">
                            {stops.length > 0 && (
                                <div className="absolute -left-8 top-0 h-8 w-0.5 bg-blue-300"></div>
                            )}
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg relative z-10">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-6 flex-1">
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="text-sm text-gray-500 mb-1">Destination</div>
                                <div className="text-2xl font-bold text-gray-900">{to}</div>
                                {arrivalTime && (
                                    <div className="text-sm text-green-600 mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Arrival: {arrivalTime}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Route Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{stops.length + 2}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Stops</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">~{totalDistance} km</div>
                    <div className="text-sm text-gray-600 mt-1">Total Distance</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600">{stops.length}</div>
                    <div className="text-sm text-gray-600 mt-1">Intermediate Stops</div>
                </div>
            </div>

            {/* Google Maps Integration Note */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <div className="font-semibold text-yellow-800">Google Maps Integration</div>
                        <div className="text-sm text-yellow-700 mt-1">
                            To enable interactive Google Maps, add your Google Maps API key to the environment variables.
                            This will show real-time traffic, satellite view, and turn-by-turn directions.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteMap;
