
import { User, UserRole, Route, Bus, BusStatus, Booking } from '../types';

const BASE = (import.meta as any).env?.VITE_API_URL;

function getToken() {
  try { return localStorage.getItem('token'); } catch (e) { return null; }
}

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as Record<string, string> || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { message: text }; }
  if (!res.ok) {
    const err: any = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status; err.body = data;
    throw err;
  }
  return data;
}

export const api = {
  login: async (email: string, password: string, role?: UserRole) => {
    return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  register: async (name: string, email: string, role?: UserRole, password?: string) => {
    return request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password: password || 'Password123!', role }) });
  },
  getUsers: async (): Promise<User[]> => request('/api/users').then((d: any) => d.users || d),
  getRoutes: async (): Promise<Route[]> => request('/api/routes').then((d: any) => d.routes || d),
  getBuses: async (): Promise<Bus[]> => request('/api/buses').then((d: any) => d.buses || d),
  findBuses: async (from: string, to: string) => request(`/api/buses/search?source=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`),
  getBusById: async (id: string) => request(`/api/buses/${id}`),
  addBusRequest: async (busData: any, owner?: User) => request('/api/buses', { method: 'POST', body: JSON.stringify(busData) }),
  approveBus: async (id: string) => request(`/api/admin/buses/${id}/approve`, { method: 'POST' }),
  rejectBus: async (id: string) => request(`/api/admin/buses/${id}/reject`, { method: 'POST' }),
  removeBus: async (id: string) => request(`/api/buses/${id}`, { method: 'DELETE' }),
  createBooking: async (busId: string, seats: string[], user?: User) => {
    const res: any = await request('/api/bookings', { method: 'POST', body: JSON.stringify({ busId, seats }) });
    // server responds with { booking } — unwrap for frontend convenience
    return res && res.booking ? res.booking : res;
  },
  getUserBookings: async (): Promise<any[]> => request('/api/bookings/my'),
  getAllBookings: async (): Promise<any[]> => request('/api/admin/bookings'),
  getBookingsForBus: async (busId: string) => request(`/api/bookings/bus/${busId}`),
  getBookedSeats: async (busId: string) => request(`/api/bookings/bus/${busId}/seats`),
  getStats: async () => request('/api/stats'),
};
