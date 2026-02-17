
export enum UserRole {
  PASSENGER = 'PASSENGER',
  BUS_OWNER = 'BUS_OWNER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum BusStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface BusStop {
  stopName: string;
  arrivalTime: string;
  departureTime: string;
  distanceFromSource: number; // in km
}

export interface Bus {
  id: string;
  busNumber: string;
  ownerId: string;
  ownerName: string;
  capacity: number;
  driverName: string;
  driverContact: string;
  status: BusStatus;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  bookedSeats: string[]; // e.g., ['A1', 'B4']
  // New fields
  stops?: BusStop[]; // Intermediate stops between source and destination
  hoursOfTravel?: number; // Total travel duration in hours
  hasReturnJourney?: boolean;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  amenities?: string[]; // e.g., ['AC', 'WiFi', 'Charging Port', 'Water Bottle']
  busType?: string; // e.g., 'Sleeper', 'Semi-Sleeper', 'Seater'
}

export interface Route {
  id: string;
  from: string;
  to: string;
}

export interface Booking {
  id: string;
  userId: string;
  busId: string;
  seats: string[];
  totalPrice: number;
  bookingDate: Date;
}

export interface BusRequest extends Omit<Bus, 'id' | 'status' | 'bookedSeats' | 'ownerName'> {
  requestId: string;
}
