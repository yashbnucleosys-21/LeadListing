import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';
import followUpHistoryRoutes from './src/routes/followUpHistory.routes.js';
import authRoutes from './src/routes/auth.routes.js'; 
import dashboardRoutes from './src/routes/dashboard.routes.js'; // ✅ ADDED: Import dashboard routes
import callLogRoutes from './src/routes/callLogRoutes.js';       // ✅ ADDED: Import call log routes


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins here
const allowedOrigins = [
  "http://localhost:8081",   // frontend dev
  "http://10.126.217.232:8081", // Ensure no trailing slash if your frontend doesn't send it
];

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or from an allowed origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Use the configured CORS options
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api', userRoutes); 
app.use('/api', roleRoutes); 
app.use('/api/leads', followUpHistoryRoutes); // Ensure this doesn't conflict with /api/leads/:id if it also handles /api/leads/:leadId/history
app.use('/api/dashboard', dashboardRoutes); // ✅ ADDED: Integrate dashboard routes
app.use('/api/call-logs', callLogRoutes);   // ✅ ADDED: Integrate call log routes


// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});