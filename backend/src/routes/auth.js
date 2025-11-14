const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken } = require('../utils/token');
const { sanitizeUser } = require('../utils/user');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { signupSchema, loginSchema, updateUserSchema } = require('../validators/authSchemas');

const router = express.Router();

const respondWithValidationError = (res, zodError) => {
  const { fieldErrors, formErrors } = zodError.flatten();
  return res.status(400).json({
    message: 'Validation failed',
    errors: {
      fieldErrors,
      formErrors,
    },
  });
};

router.post('/signup', async (req, res, next) => {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return respondWithValidationError(res, parsed.error);
    }

    const { name, email, password, role } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const token = signToken({ id: user._id.toString(), role: user.role });

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return respondWithValidationError(res, parsed.error);
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken({ id: user._id.toString(), role: user.role });

    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

// Update current user's profile (except email)
router.patch('/me', authMiddleware, async (req, res, next) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return respondWithValidationError(res, parsed.error);
    }

    const { name, password } = parsed.data;
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

// Admin only: Get all users with pagination and search
router.get('/users', adminMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(searchQuery);

    // Get users with pagination
    const users = await User.find(searchQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      users: users.map((user) => sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
});

// Admin only: Delete user
router.delete('/users/:id', adminMiddleware, async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

