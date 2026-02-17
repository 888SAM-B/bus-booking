const mongoose = require('mongoose');
require('dotenv').config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/bus_booking';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASS = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Admin';

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String });
const User = mongoose.model('User', UserSchema);

async function main() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  const emailNorm = (ADMIN_EMAIL || '').trim().toLowerCase();
  // NOTE: bcrypt removed intentionally — password will be stored as provided (plaintext).
  // If you later want hashing, re-introduce bcrypt and hash ADMIN_PASS here.
  const passwordToStore = ADMIN_PASS;
  const res = await User.findOneAndUpdate(
    { email: emailNorm },
    { $set: { name: ADMIN_NAME, email: emailNorm, password: passwordToStore, role: 'Admin' } },
    { upsert: true, new: true }
  );
  console.log('Admin seeded (password stored as plaintext):', res.email);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });