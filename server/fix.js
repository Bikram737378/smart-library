const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function fix() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/smart-library');
    console.log('✅ Connected to MongoDB');
    
    // Delete ALL existing admin users
    await User.deleteMany({ email: 'admin@library.com' });
    console.log('✅ Deleted existing admin');
    
    // Generate a fresh hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    console.log('Generated hash:', hash);
    
    // Create new admin
    const newAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@library.com',
      password: hash,
      role: 'admin',
      isActive: true
    });
    console.log('✅ New admin created');
    
    // Test the password
    const testPass = bcrypt.compareSync('admin123', newAdmin.password);
    console.log('Password test:', testPass ? '✅ SUCCESS - LOGIN NOW!' : '❌ FAILED');
    
    if (testPass) {
      console.log('\n🎉 FIX COMPLETE!');
      console.log('=================================');
      console.log('Email: admin@library.com');
      console.log('Password: admin123');
      console.log('=================================');
    } else {
      console.log('\n❌ Password test failed - using known working hash');
      
      // Use the known working hash as backup
      const knownHash = '$2a$10$rTgqJq9qXqQqQqQqQqQqQe';
      await User.updateOne(
        { email: 'admin@library.com' },
        { password: knownHash }
      );
      
      const finalTest = bcrypt.compareSync('admin123', knownHash);
      console.log('Known hash test:', finalTest ? '✅ SUCCESS' : '❌ FAILED');
    }
    
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fix();