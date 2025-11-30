const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'True Valence Mapper API is running' });
});

const coachRoutes = require('./routes/coaches');
const clientRoutes = require('./routes/clients');
const sessionRoutes = require('./routes/sessions');

const { router: authRoutes, authenticateToken } = require('./auth');

app.use('/api/auth', authRoutes);
// Protect other routes
app.use('/api/coaches', authenticateToken, coachRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/sessions', authenticateToken, sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
