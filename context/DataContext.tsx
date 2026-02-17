
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Bus, Route, Booking, BusStatus, User } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  buses: Bus[];
  routes: Route[];
  bookings: Booking[];
  users: User[];
  loading: boolean;
  error: string | null;
  findBuses: (from: string, to: string) => Promise<Bus[]>;
  getBusById: (busId: string) => Promise<Bus | undefined>;
  getBookingsForBus: (busId: string) => Promise<import('../types').Booking[]>;
  addBusRequest: (busData: Omit<Bus, 'id' | 'status' | 'bookedSeats'>) => Promise<void>;
  approveBus: (busId: string) => Promise<void>;
  rejectBus: (busId: string) => Promise<void>;
  createBooking: (busId: string, seats: string[]) => Promise<Booking | null>;
  removeBus: (busId: string) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  alertPassengers: (busId: string) => Promise<void>;
  getOwnerBuses: (ownerId: string) => Bus[];
  getBusRequests: () => Bus[];
  getUserBookings: () => Promise<any[]>;
  getAllBookings: () => Promise<any[]>;
  getStats: () => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [busesData, routesData, usersData] = await Promise.all([
        api.getBuses(),
        api.getRoutes(),
        api.getUsers(),
      ]);
      setBuses(busesData);
      setRoutes(routesData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch initial data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const findBuses = async (from: string, to: string) => {
    return api.findBuses(from, to);
  };

  const getBusById = async (busId: string) => {
    return api.getBusById(busId);
  }

  const getBookingsForBus = async (busId: string) => {
    return api.getBookingsForBus(busId);
  }

  const addBusRequest = async (busData: Omit<Bus, 'id' | 'status' | 'bookedSeats'>) => {
    if (!user) throw new Error("User not authenticated");
    await api.addBusRequest(busData, user);
    await fetchData(); // Refetch all data
  };

  const getOwnerBuses = (ownerId: string) => {
    return buses.filter(b => b.ownerId === ownerId);
  };

  const getBusRequests = () => {
    return buses.filter(b => b.status === BusStatus.PENDING);
  }

  const approveBus = async (busId: string) => {
    await api.approveBus(busId);
    await fetchData();
  };

  const rejectBus = async (busId: string) => {
    await api.rejectBus(busId);
    await fetchData();
  };

  const createBooking = async (busId: string, seats: string[]): Promise<Booking | null> => {
    if (!user) return null;
    const newBooking = await api.createBooking(busId, seats, user);
    await fetchData(); // Refetch to update booked seats
    return newBooking;
  };

  const removeBus = async (busId: string) => {
    if (window.confirm('Are you sure you want to permanently remove this bus?')) {
      await api.removeBus(busId);
      await fetchData();
    }
  };

  const removeUser = async (userId: string) => {
    const userToRemove = users.find(u => u.id === userId);
    if (!userToRemove) return;

    if (userToRemove.role === 'ADMIN') {
      alert('The administrator account cannot be removed.');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove user "${userToRemove.name}"?`)) {
      await api.removeBus(userId);
      await fetchData();
    }
  };

  const alertPassengers = async (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) {
      alert('Error: Bus not found.');
      return;
    }

    // In a real app, bookings would be fetched from the API per bus
    // For this simulation, we'll get them from the mock API
    const relevantBookings = await api.getBookingsForBus(busId);

    if (relevantBookings.length === 0) {
      alert(`No passengers have booked bus "${bus.busNumber}" yet.`);
      return;
    }

    const passengerIds = new Set(relevantBookings.map(b => b.userId));
    const allUsers = await api.getUsers();
    const passengerNames = allUsers
      .filter(u => passengerIds.has(u.id))
      .map(u => u.name);

    if (passengerNames.length === 0) {
      alert(`Could not find passenger details for bus "${bus.busNumber}".`);
      return;
    }

    const notificationMessage = `The following passengers of bus "${bus.busNumber}" have been alerted that the bus is nearby:\n\n- ${passengerNames.join('\n- ')}`;
    alert(notificationMessage);
  };

  const getStats = async () => {
    return api.getStats();
  };

  const getUserBookings = async () => {
    return api.getUserBookings();
  };

  const getAllBookings = async () => {
    return api.getAllBookings();
  };

  return (
    <DataContext.Provider value={{ buses, routes, bookings, users, loading, error, findBuses, getBusById, getBookingsForBus, addBusRequest, getOwnerBuses, getBusRequests, approveBus, rejectBus, createBooking, removeBus, removeUser, alertPassengers, getStats, getUserBookings, getAllBookings }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
