// scripts/createAdmin.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../data/config.js';

const createAdminUser = async () => {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ email: 'admin@textil.com' });
    
    if (!adminExists) {
      const adminUser = new User({
        email: 'admin@textil.com',
        password: 'admin123', // Se hasheará automáticamente
        name: 'Administrador',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Usuario administrador creado exitosamente');
      console.log('Email: admin@textil.com');
      console.log('Password: admin123');
    } else {
      console.log('El usuario administrador ya existe');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creando usuario administrador:', error);
    process.exit(1);
  }
};

createAdminUser();