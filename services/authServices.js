// services/authServices.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'TEXTIL';

export async function registerUser(userData) {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error("Error al registrar usuario");
  }
}

export async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido");
  }
}