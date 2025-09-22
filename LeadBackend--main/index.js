import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';
import followUpHistoryRoutes from './src/routes/followUpHistory.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import callLogRoutes from './src/routes/callLogRoutes.js'; // ✅ Add this line

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define allowed origins here

const allowedOrigins = [
  process.env.FRONTEND_URL, // Vercel frontend
  "http://localhost:5173",   // frontend dev
];


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/call-logs', callLogRoutes); // ✅ Add this line
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api/leads', followUpHistoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start server
app.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is running on https://lead-listing.vercel.app`);
});