import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyGoogleToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/google', async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Google token required' });
    }

    const payload = await verifyGoogleToken(token);

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;