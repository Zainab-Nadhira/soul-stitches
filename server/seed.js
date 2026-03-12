require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soul-stitches')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'user' }, wishlist: [], addresses: [], phone: String, isActive: { type: Boolean, default: true } });
const User = mongoose.model('User', UserSchema);

async function seed() {
  try {
    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@soulstitches.in' });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash('admin123', 12);
      await User.create({ name: 'Soul Stitches Admin', email: 'admin@soulstitches.in', password: hashed, role: 'admin', phone: '+91 98765 43210' });
      console.log('✅ Admin user created');
      console.log('   Email: admin@soulstitches.in');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    console.log('\n🧶 Seed complete! Use the Admin Dashboard to seed products.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
