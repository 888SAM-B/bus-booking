import { User, UserRole, Route, Bus, BusStatus } from './types';

export const USERS: User[] = [
  { id: 'u1', email: 'passenger@busbooking.com', name: 'John Doe', role: UserRole.PASSENGER },
  { id: 'u2', email: 'owner@busbooking.com', name: 'Jane Smith', role: UserRole.BUS_OWNER },
  { id: 'u3', email: 'admin@busbooking.com', name: 'Admin User', role: UserRole.ADMIN },
];

export const ROUTES: Route[] = [
  { id: 'r1', from: 'Chennai', to: 'Bangalore' },
  { id: 'r2', from: 'Bangalore', to: 'Chennai' },
  { id: 'r3', from: 'Coimbatore', to: 'Chennai' },
  { id: 'r4', from: 'Chennai', to: 'Coimbatore' },
  { id: 'r5', from: 'Bangalore', to: 'Hyderabad' },
  { id: 'r6', from: 'Hyderabad', to: 'Bangalore' },
  { id: 'r7', from: 'Chennai', to: 'Madurai' },
  { id: 'r8', from: 'Madurai', to: 'Chennai' },
];

export const BUSES: Bus[] = [
  { 
    id: 'b1', 
    busNumber: 'TN 01 AB 1234', 
    ownerId: 'u2',
    ownerName: 'Jane Smith',
    capacity: 40,
    driverName: 'Kumar',
    driverContact: '123-456-7890',
    status: BusStatus.APPROVED, 
    routeId: 'r1', // Chennai to Bangalore
    departureTime: '10:00 PM',
    arrivalTime: '05:00 AM',
    price: 750,
    bookedSeats: ['A1', 'A2', 'C5', 'D8']
  },
  { 
    id: 'b2', 
    busNumber: 'KA 01 CD 5678', 
    ownerId: 'u2',
    ownerName: 'Jane Smith',
    capacity: 40,
    driverName: 'Suresh',
    driverContact: '098-765-4321',
    status: BusStatus.APPROVED, 
    routeId: 'r1', // Chennai to Bangalore
    departureTime: '11:00 PM',
    arrivalTime: '06:00 AM',
    price: 800,
    bookedSeats: ['B1', 'B2', 'B3']
  },
  { 
    id: 'b3', 
    busNumber: 'TN 38 EF 9012', 
    ownerId: 'u2', 
    ownerName: 'Jane Smith',
    capacity: 50,
    driverName: 'Ravi',
    driverContact: '555-555-5555',
    status: BusStatus.APPROVED, 
    routeId: 'r3', // Coimbatore to Chennai
    departureTime: '09:00 PM',
    arrivalTime: '05:00 AM',
    price: 950,
    bookedSeats: []
  },
  { 
    id: 'b4', 
    busNumber: 'TS 09 GH 3456', 
    ownerId: 'u2', 
    ownerName: 'Jane Smith',
    capacity: 40,
    driverName: 'Anand',
    driverContact: '444-444-4444',
    status: BusStatus.APPROVED, 
    routeId: 'r5', // Bangalore to Hyderabad
    departureTime: '09:30 PM',
    arrivalTime: '07:00 AM',
    price: 1100,
    bookedSeats: ['A3', 'A4', 'C1', 'C2']
  },
];
