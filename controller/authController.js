// controller/authController.js
import { registerUser, loginUser } from '../services/authServices.js';

export const registerController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    
    res.json({
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const verifyTokenController = async (req, res) => {
  try {
    // Si el middleware authenticateToken pasó, el token es válido
    res.json({ valid: true, user: req.user });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token inválido' });
  }
};
