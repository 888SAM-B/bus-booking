import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { getStats } = useData();
    const [stats, setStats] = useState({
        totalBookings: '12K+',
        busOperators: '450+',
        citiesConnected: '80+'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                if (data) {
                    setStats({
                        totalBookings: data.totalBookings.toLocaleString() + '+',
                        busOperators: data.busOperators.toString() + '+',
                        citiesConnected: data.citiesConnected.toString() + '+'
                    });
                }
            } catch (err) {
                console.error('Failed to fetch real-time stats:', err);
            }
        };
        fetchStats();
    }, [getStats]);

    const features = [
        { icon: '🚌', title: 'Wide Network', description: 'Access to thousands of buses across multiple routes and destinations' },
        { icon: '💺', title: 'Easy Booking', description: 'Book your seats in just a few clicks with our intuitive interface' },
        { icon: '⚡', title: 'Instant Confirmation', description: 'Get instant booking confirmation via email and SMS' },
        { icon: '🎫', title: 'Digital Tickets', description: 'No need for paper tickets - show your digital ticket and board' },
        { icon: '📞', title: '24/7 Support', description: 'Round the clock customer support for all your queries' }
    ];

    const steps = [
        { number: '01', title: 'Search', description: 'Enter your source, destination, and travel date' },
        { number: '02', title: 'Select', description: 'Choose from available buses and pick your preferred seats' },
        { number: '03', title: 'Confirm', description: 'Confirm your booking and get your ticket' },
        { number: '04', title: 'Travel', description: 'Show your digital ticket and enjoy your journey' }
    ];

    return (
        <div className="landing-page overflow-x-hidden">
            {/* Hero Section */}
            <section className="hero-section min-h-[90vh] flex items-center relative py-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 opacity-95"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                    {/* Animated Glows */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[160px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-left animate-slideInLeft">
                            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 font-semibold text-sm mb-6 backdrop-blur-md">
                                ✨ The Most Trusted Bus Booking Platform
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                Travel the <span className="gradient-text">Premium</span> Way.
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100/80 mb-10 leading-relaxed max-w-xl">
                                Experience seamless travel with India's fastest-growing bus booking network. Secure your seat in seconds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="btn btn-accent text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-orange-500/20 hover:scale-105 transition-all duration-300"
                                >
                                    Post Your Journey
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn bg-white/5 backdrop-blur-xl border border-white/20 text-white text-lg px-10 py-5 rounded-2xl hover:bg-white/10 transition-all duration-300"
                                >
                                    Search Buses
                                </button>
                            </div>

                            {/* Stats Bar */}
                            <div className="grid grid-cols-3 gap-8 mt-16 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 max-w-2xl">
                                <div className="text-center group">
                                    <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{stats.totalBookings}</div>
                                    <div className="text-blue-300/60 text-xs font-bold uppercase tracking-widest">Bookings</div>
                                </div>
                                <div className="text-center group border-x border-white/10">
                                    <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{stats.busOperators}</div>
                                    <div className="text-blue-300/60 text-xs font-bold uppercase tracking-widest">Operators</div>
                                </div>
                                <div className="text-center group">
                                    <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{stats.citiesConnected}</div>
                                    <div className="text-blue-300/60 text-xs font-bold uppercase tracking-widest">Cities</div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block animate-slideInRight">
                            <div className="relative">
                                {/* Animated Bus Illustration Placeholder */}
                                <div className="w-full aspect-square bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-[4rem] border border-white/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-10 group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700"></div>
                                    <div className="text-[12rem] animate-bounce-slow">🚌</div>

                                    {/* Floating elements */}
                                    <div className="absolute bottom-20 left-10 bg-green-500/20 backdrop-blur-md p-4 rounded-2xl border border-green-400/20 animate-pulse" style={{ animationDelay: '1s' }}>
                                        <div className="text-green-400 text-xs font-bold mb-1">SAFE JOURNEY</div>
                                        <div className="text-white text-sm font-bold">100% SECURE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features & Other Sections remain as they are, but with polished utility classes from index.css */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">Experience Excellence</h2>
                        <div className="h-2 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <div key={index} className="card p-10 hover:shadow-3xl transition-all duration-500 border border-gray-100 group">
                                <div className="text-6xl mb-8 group-hover:scale-125 transition-transform duration-500 inline-block">{feature.icon}</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works with modern timeline */}
            <section className="py-32 bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">How It Works</h2>
                            <p className="text-xl text-gray-500 mb-12">Booking a ticket has never been this easy. Follow these four simple steps to get started.</p>

                            <div className="space-y-12">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-8 group">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                                            {step.number}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h4>
                                            <p className="text-gray-500 text-lg">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white shadow-3xl">
                                <div className="text-4xl font-bold mb-8">Travel with Confidence</div>
                                <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                                    Join millions of happy travelers who trust us for their daily commutes and long journeys. Our platform ensures the highest standards of safety and comfort.
                                </p>
                                <div className="flex -space-x-4 mb-8">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-blue-600 bg-gray-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-blue-600 bg-blue-400 flex items-center justify-center font-bold">+</div>
                                </div>
                                <div className="text-sm font-bold text-blue-200">TRUSTED BY 12M+ TRAVELERS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer & CTA simplified */}
            <section className="py-32 bg-blue-900 relative overflow-hidden">
                <div className="container text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-10">Start Your Adventure.</h2>
                    <button onClick={() => navigate('/register')} className="btn btn-accent text-xl px-12 py-6 rounded-2xl shadow-2xl">Book My First Trip</button>
                </div>
            </section>

            <footer className="bg-black py-20 text-gray-500 border-t border-white/5">
                <div className="container text-center">
                    <div className="text-2xl font-bold text-white mb-8">BusBooking Premium</div>
                    <p className="text-sm">© 2026 Premium Bus Booking System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
