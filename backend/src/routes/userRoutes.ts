import express, { Request, Response, NextFunction, Router } from 'express';
import mongoose from 'mongoose';

import User, { UserRole } from '../database/models/User';
import { requireAdmin } from '../middleware/auth';

const router: Router = express.Router();

// Get all users (admin only)
router.get('/', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().sort({ email: 1 });
    console.log(`Info: Users found: ${users.length}`);

    res.status(200).json({
      message: 'Users retrieved successfully!',
      users: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
});

// Get current user's info
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    const user = await User.findOne({ email: req.user.email.toLowerCase() });

    res.status(200).json({
      message: 'User info retrieved successfully!',
      user: user || { email: req.user.email, role: null }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
});

// Create or update user (admin only)
router.post('/', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        error: 'Email and role are required'
      });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update existing user
      user.role = role;
      await user.save();
      console.log(`Info: User updated: ${user._id}`);
    } else {
      // Create new user
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email.toLowerCase(),
        role: role
      });
      await user.save();
      console.log(`Info: User created: ${user._id}`);
    }

    res.status(200).json({
      message: 'User saved successfully!',
      user: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
});

// Update user role (admin only)
router.put('/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        error: 'Role is required'
      });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        error: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    console.log(`Info: User role updated: ${userId}`);

    res.status(200).json({
      message: 'User role updated successfully!',
      user: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    console.log(`Info: User deleted: ${userId}`);

    res.status(200).json({
      message: 'User deleted successfully!',
      result: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    });
  }
});

export default router;
