const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const session = require('express-session');
const passport = require('./config/passport');

const cors = require('cors');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const postRoutes = require('./routes/postRoutes'); // 
const jobRoutes = require('./routes/jobRoutes');
const startupRoutes = require('./routes/startupRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const eventRoutes = require('./routes/eventRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const searchRoutes = require('./routes/searchRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

connectDB();

const app = express();

// Trust proxy in production (needed for secure cookies behind reverse proxies)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// 3. Create an HTTP server from the Express app
const server = http.createServer(app);

// 4. Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://alumni-verse-frontend.vercel.app"], // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Enable CORS for Express with credentials support (required for OAuth)
app.use(cors({
  origin: ["http://localhost:5173", "https://alumni-verse-frontend.vercel.app"],
  credentials: true, // Allow cookies to be sent with requests
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json());

// Session middleware (required for OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: true, // Must be true so passport can store OAuth state before redirect
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'lax' works for OAuth top-level redirects in both dev and prod
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/conversations', conversationRoutes);

// Socket.IO connection logic will go here (see next step)
require('./socketHandler')(io);

const PORT = process.env.PORT || 5000;

// 5. Start the HTTP server instead of the Express app
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));