const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'This email is already registered.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ message: 'Account created. You can now log in.', user: publicUser(user) });
  } catch (e) { res.status(500).json({ message: 'Server error.' }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(400).json({ message: 'Incorrect email or password.' });
    res.json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (e) { res.status(500).json({ message: 'Server error.' }); }
};

// JWT is stateless: the client deletes its token. This route confirms logout.
exports.logout = (req, res) => res.json({ message: 'Logged out.' });

exports.me = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(publicUser(user));
};
