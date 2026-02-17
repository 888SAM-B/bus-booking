import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BusStatus, UserRole } from '../types';

type AdminView = 'approvals' | 'buses' | 'users' | 'bookings';

const ApprovalQueue: React.FC = () => {
  const { getBusRequests, approveBus, rejectBus } = useData();
  const busRequests = getBusRequests();

  if (busRequests.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pending Requests</h3>
        <p className="text-gray-600">All bus registration requests have been processed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {busRequests.map(bus => (
        <div key={bus.id} className="card p-6 border-l-8 border-orange-500 hover:shadow-xl transition-all">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-gray-900 mb-1">{bus.busNumber}</h4>
              <p className="text-gray-600 mb-3">Owner: <span className="font-semibold">{bus.ownerName}</span></p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary">{bus.busType || 'Standard'}</span>
                <span className="badge badge-primary">{bus.capacity} Seats</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">Journey Details</div>
              <div className="font-bold text-gray-900">{bus.departureTime} - {bus.arrivalTime}</div>
              <div className="text-sm text-blue-600 font-semibold">₹{bus.price} per seat</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => approveBus(bus.id)}
                className="btn btn-primary bg-green-600 hover:bg-green-700 w-full"
              >
                Approve
              </button>
              <button
                onClick={() => rejectBus(bus.id)}
                className="btn btn-outline border-red-500 text-red-600 hover:bg-red-500 w-full"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BusManagement: React.FC = () => {
  const { buses, removeBus } = useData();
  const approvedBuses = buses.filter(b => b.status === BusStatus.APPROVED);

  return (
    <div className="card p-0 overflow-hidden shadow-xl">
      <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Registered Buses ({approvedBuses.length})</h3>
        <span className="badge badge-success">Live System</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold text-left uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Bus Detail</th>
              <th className="py-4 px-6">Owner</th>
              <th className="py-4 px-6">Capacity</th>
              <th className="py-4 px-6">Utilization</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {approvedBuses.map(bus => {
              const utilization = ((bus.bookedSeats.length / bus.capacity) * 100).toFixed(1);
              return (
                <tr key={bus.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{bus.busNumber}</div>
                    <div className="text-xs text-gray-500">{bus.busType || 'Standard'}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-700">{bus.ownerName}</td>
                  <td className="py-4 px-6 text-gray-900">{bus.capacity} Seats</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-3">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${utilization}%` }}></div>
                      </div>
                      <span className="font-semibold">{utilization}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => removeBus(bus.id)}
                      className="text-red-500 hover:text-red-700 font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {approvedBuses.length === 0 && (
          <div className="p-12 text-center text-gray-500">No approved buses yet.</div>
        )}
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const { users, removeUser } = useData();

  return (
    <div className="card p-0 overflow-hidden shadow-xl">
      <div className="bg-gray-50 p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">User Management ({users.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold text-left uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`badge ${user.role === UserRole.ADMIN ? 'badge-danger' :
                    user.role === UserRole.BUS_OWNER ? 'badge-primary' : 'badge-success'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-red-500 hover:text-red-700 font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={user.role === UserRole.ADMIN}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BookingManagement: React.FC = () => {
  const { getAllBookings } = useData();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [getAllBookings]);

  if (loading) return <div className="p-20 text-center"><div className="spinner"></div></div>;

  return (
    <div className="card p-0 overflow-hidden shadow-xl">
      <div className="bg-gray-50 p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">All System Bookings ({bookings.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold text-left uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Passenger</th>
              <th className="py-4 px-6">Bus/Route</th>
              <th className="py-4 px-6">Seats</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(bk => (
              <tr key={bk.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-900">{bk.user?.name || 'Guest'}</div>
                  <div className="text-xs text-gray-500">{bk.user?.email || bk.userId}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-900">{bk.bus?.busNumber}</div>
                  <div className="text-xs text-blue-600 font-semibold">{bk.bus?.ownerName}</div>
                </td>
                <td className="py-4 px-6 text-gray-700 font-medium">
                  {bk.seats.join(", ")}
                </td>
                <td className="py-4 px-6 font-bold text-gray-900">₹{bk.totalPrice}</td>
                <td className="py-4 px-6">
                  <span className="badge badge-success">{bk.status || 'CONFIRMED'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="p-12 text-center text-gray-500">No bookings found in the system.</div>
        )}
      </div>
    </div>
  );
};


const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('approvals');
  const { loading, error } = useData();

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-20">
          <div className="spinner"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="card bg-red-50 border-red-200 p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )
    }

    switch (activeView) {
      case 'approvals':
        return <ApprovalQueue />;
      case 'buses':
        return <BusManagement />;
      case 'users':
        return <UserManagement />;
      case 'bookings':
        return <BookingManagement />;
      default:
        return null;
    }
  };

  const getButtonClass = (view: AdminView) => {
    const isActive = activeView === view;
    return `px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center ${isActive
      ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1'
      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
      }`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Admin Control Center</h1>
            <p className="text-gray-500 text-lg">Manage platform approvals, fleet status and user accounts</p>
          </div>
          <div className="mt-4 md:mt-0 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span className="font-semibold text-gray-700">System Online</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-10 bg-white/50 p-2 rounded-2xl border border-gray-100 backdrop-blur-sm sticky top-20 z-40">
          <button className={getButtonClass('approvals')} onClick={() => setActiveView('approvals')}>
            <span className="mr-2">📋</span> Bus Approvals
          </button>
          <button className={getButtonClass('buses')} onClick={() => setActiveView('buses')}>
            <span className="mr-2">🚍</span> Manage Fleet
          </button>
          <button className={getButtonClass('users')} onClick={() => setActiveView('users')}>
            <span className="mr-2">👥</span> Manage Users
          </button>
          <button className={getButtonClass('bookings')} onClick={() => setActiveView('bookings')}>
            <span className="mr-2">🎟️</span> All Bookings
          </button>
        </div>

        <div className="animate-fadeIn">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
