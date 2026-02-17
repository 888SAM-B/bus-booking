const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bus_booking';
mongoose.connect(mongoUri).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Models
const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
UserSchema.virtual('id').get(function () { return this._id.toString(); });
const BusSchema = new mongoose.Schema({
  busNumber: String,
  ownerId: String,
  ownerName: String,
  // route reference - frontend uses routeId
  routeId: String,
  // capacity field used across the frontend
  capacity: Number,
  // driver fields
  driverName: String,
  driverContact: String,
  // timings
  departureTime: String,
  arrivalTime: String,
  status: String,
  price: Number,
  bookedSeats: [String],
  // New fields
  busType: String,
  hoursOfTravel: Number,
  amenities: [String],
  stops: [{
    stopName: String,
    arrivalTime: String,
    departureTime: String,
    distanceFromSource: Number
  }],
  hasReturnJourney: Boolean,
  returnDepartureTime: String,
  returnArrivalTime: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// expose `id` for frontend convenience
BusSchema.virtual('id').get(function () { return this._id.toString(); });
const BookingSchema = new mongoose.Schema({
  userId: String,
  busId: String,
  seats: [String],
  totalPrice: Number,
  bookingDate: Date,
  status: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
BookingSchema.virtual('id').get(function () { return this._id.toString(); });

const User = mongoose.model('User', UserSchema);
const Bus = mongoose.model('Bus', BusSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// Simple in-memory sample routes (quickfix so frontend has route options)
const SAMPLE_ROUTES = [
  { id: 'r1', from: 'Chennai', to: 'Bangalore' },
  { id: 'r2', from: 'Bangalore', to: 'Chennai' },
  { id: 'r3', from: 'Coimbatore', to: 'Chennai' },
  { id: 'r4', from: 'Chennai', to: 'Coimbatore' },
  { id: 'r5', from: 'Bangalore', to: 'Hyderabad' },
  { id: 'r6', from: 'Hyderabad', to: 'Bangalore' },
  { id: 'r7', from: 'Chennai', to: 'Madurai' },
  { id: 'r8', from: 'Madurai', to: 'Chennai' },
];

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: safe lowercased email
function normalizeEmail(e) {
  return (e || '').trim().toLowerCase();
}

// Auth - REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

    const emailNorm = normalizeEmail(email);
    const existing = await User.findOne({ email: emailNorm });
    if (existing) return res.status(400).json({ message: 'User exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: emailNorm, password: hash, role });
    // do not return password
    const userSafe = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.json({ message: 'User registered', user: userSafe });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth - LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const emailNorm = normalizeEmail(email);
    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      console.warn('Login failed - user not found:', emailNorm);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password: support both bcrypt-hashed passwords and plaintext stored passwords
    let ok = false;
    try {
      const stored = user.password || '';
      if (typeof stored === 'string' && stored.startsWith('$2')) {
        // bcrypt hash
        ok = await bcrypt.compare(password, stored);
      } else {
        // plaintext compare
        ok = password === stored;
      }
    } catch (e) {
      console.error('Password compare error', e);
      ok = false;
    }
    if (!ok) {
      console.warn('Login failed - invalid password for:', emailNorm);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Malformed token' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; next();
  } catch (e) {
    console.warn('JWT verify failed:', e.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Stats endpoint for Landing Page
app.get('/api/stats', async (req, res) => {
  try {
    const [busCount, bookingCount, userCount, routeCount] = await Promise.all([
      Bus.countDocuments({ status: 'APPROVED' }),
      Booking.countDocuments({}),
      User.countDocuments({ role: 'BUS_OWNER' }),
      Promise.resolve(new Set(SAMPLE_ROUTES.map(r => r.from)).size + new Set(SAMPLE_ROUTES.map(r => r.to)).size)
    ]);

    res.json({
      totalBookings: bookingCount + 12500, // Real + Mock for premium feel
      busOperators: userCount + 450,
      citiesConnected: routeCount + 80
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buses
app.get('/api/buses/search', async (req, res) => {
  try {
    const { source, destination } = req.query;
    const buses = await Bus.find({ status: 'APPROVED' });
    res.json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Return all buses
app.get('/api/buses', async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Return users (no passwords)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simple routes endpoint (frontend may rely on routes list)
app.get('/api/routes', async (req, res) => {
  try {
    // return sample static routes for now (replace with DB-backed routes later)
    res.json(SAMPLE_ROUTES);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/buses', auth, async (req, res) => {
  try {
    const data = req.body;
    // Basic validation to ensure frontend fields are present
    if (!data.busNumber || !data.capacity || !data.routeId || !data.departureTime || !data.arrivalTime) {
      return res.status(400).json({ message: 'Missing required bus fields' });
    }
    const bus = await Bus.create({ ...data, ownerId: req.user.id, ownerName: req.user.name, status: 'PENDING', bookedSeats: [] });
    res.json({ bus });
  } catch (err) {
    console.error('Create bus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Not found' });
    res.json(bus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookings
app.post('/api/bookings', auth, async (req, res) => {
  try {
    const { busId, seats } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    const conflict = (seats || []).some(s => bus.bookedSeats.includes(s));
    if (conflict) return res.status(400).json({ message: 'Some seats already booked' });

    const booking = await Booking.create({ userId: req.user.id, busId, seats, totalPrice: (bus.price || 0) * (seats.length || 0), bookingDate: new Date(), status: 'CONFIRMED' });
    bus.bookedSeats.push(...seats);
    await bus.save();
    res.json({ booking });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookings/bus/:busId/seats', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json({ bookedSeats: bus.bookedSeats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookings/bus/:busId', async (req, res) => {
  try {
    const bookings = await Booking.find({ busId: req.params.busId });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged-in user's bookings
app.get('/api/bookings/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    // Fetch bus details for each booking to show bus number/route
    const populatedBookings = await Promise.all(bookings.map(async (b) => {
      const bus = await Bus.findById(b.busId);
      return { ...b.toJSON(), bus };
    }));
    res.json(populatedBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all bookings
app.get('/api/admin/bookings', auth, async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const bookings = await Booking.find({});
    const populated = await Promise.all(bookings.map(async (b) => {
      const bus = await Bus.findById(b.busId);
      const user = await User.findById(b.userId, { password: 0 });
      return { ...b.toJSON(), bus, user };
    }));
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin approve
app.post('/api/admin/buses/:id/approve', auth, async (req, res) => {
  try {
    // require admin role
    if (!req.user.role || req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Not found' });
    bus.status = 'APPROVED';
    await bus.save();
    res.json({ bus });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin reject endpoint (used by frontend)
app.post('/api/admin/buses/:id/reject', auth, async (req, res) => {
  try {
    if (!req.user.role || req.user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Not found' });
    bus.status = 'REJECTED';
    await bus.save();
    res.json({ bus });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dev-only debug route to list users (DO NOT enable in production)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/users', async (req, res) => {
    const users = await User.find({}, { password: 0 }); // hide password
    res.json(users);
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server running on', port));