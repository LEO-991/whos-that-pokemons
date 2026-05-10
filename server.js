// Project : Who's That Pokémon?
// Authors : [Saro,Lennon & Amlag, Raymond]
// Date    : May 2026
// Course  : APPDEV1

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Score = require('./models/Score');
const History = require('./models/History');

const app = express();
app.use(cors());
app.use(express.json());

// ─── DB Connection ────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ─── Middleware: Verify JWT ───────────────────────────────────────────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role: 'user' });
    await user.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── User Routes ──────────────────────────────────────────────────────────────
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/users/me/username', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });
    await User.findByIdAndUpdate(req.user.id, { username });
    res.json({ message: 'Username updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/users/me/history', verifyToken, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: 'History deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/users/me', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    await Score.deleteMany({ userId: req.user.id });
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Game Routes ──────────────────────────────────────────────────────────────
app.post('/api/game/score', verifyToken, async (req, res) => {
  try {
    const { difficulty, score } = req.body;
    const existing = await Score.findOne({ userId: req.user.id, difficulty });
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        await existing.save();
      }
    } else {
      await new Score({ userId: req.user.id, difficulty, score }).save();
    }
    res.json({ message: 'Score saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/game/history', verifyToken, async (req, res) => {
  try {
    const { pokemonName, result } = req.body;
    await new History({ userId: req.user.id, pokemonName, result, date: new Date() }).save();
    res.json({ message: 'History saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/game/history', verifyToken, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ date: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/game/score', verifyToken, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Leaderboard Routes ───────────────────────────────────────────────────────
app.get('/api/leaderboard/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const scores = await Score.find({ difficulty })
      .sort({ score: -1 })
      .limit(10)
      .populate('userId', 'username');  // ✅ Already here
    const leaderboard = scores.map((s, index) => ({
      rank: index + 1,
      username: s.userId?.username || 'Unknown',  // ✅ Already here
      score: s.score
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already taken' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { username, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { username, role });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Score.deleteMany({ userId: req.params.id });
    await History.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Create Default Admin User ────────────────────────────────────────────────
async function createDefaultAdmin() {
  const adminExists = await User.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await new User({ username: 'admin', password: hashed, role: 'admin' }).save();
    console.log('Default admin created: admin / admin123');
  }
}
// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(3000, async () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       🚀 Who\'s That Pokémon API        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║  Server   : http://localhost:3000      ║');
  console.log('║  Status   : Running ✅                 ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');

  await createDefaultAdmin();

  try {
    console.log('📊 Live MongoDB Data:');
    console.log('─────────────────────────────────────────');

    // ── Users ──
    const users = await User.find().select('-password');
    console.log(`👥 Users (${users.length}):`);
    users.forEach(u => {
      console.log(`   _id        : ${u._id}`);
      console.log(`   username   : ${u.username}`);
      console.log(`   role       : ${u.role}`);
      console.log(`   createdAt  : ${u.createdAt}`);
      console.log(`   updatedAt  : ${u.updatedAt}`);
      console.log('   ───────────────────────────────────');
    });

    // ── Scores ──
    const scores = await Score.find().populate('userId', 'username');
    console.log(`\n🏆 Scores (${scores.length}):`);
    scores.forEach(s => {
      console.log(`   _id        : ${s._id}`);
      console.log(`   userId     : ${s.userId?._id}`);
      console.log(`   username   : ${s.userId?.username || 'Unknown'}`);
      console.log(`   difficulty : "${s.difficulty}"`);
      console.log(`   score      : ${s.score}`);
      console.log(`   createdAt  : ${s.createdAt}`);
      console.log(`   updatedAt  : ${s.updatedAt}`);
      console.log('   ───────────────────────────────────');
    });

    // ── History ──
    const history = await History.find().populate('userId', 'username');
    console.log(`\n📜 History (${history.length}):`);
    history.forEach(h => {
      console.log(`   _id        : ${h._id}`);
      console.log(`   userId     : ${h.userId?._id}`);
      console.log(`   username   : ${h.userId?.username || 'Unknown'}`);
      console.log(`   pokemonName: ${h.pokemonName}`);
      console.log(`   result     : "${h.result}"`);
      console.log(`   date       : ${h.date}`);
      console.log('   ───────────────────────────────────');
    });

  } catch (err) {
    console.error('❌ Error fetching MongoDB data:', err.message);
  }

  console.log('─────────────────────────────────────────');
});
