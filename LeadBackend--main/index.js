// // // backend/src/index.js
// // import express from 'express';
// // import dotenv from 'dotenv';
// // import cors from 'cors';
// // import userRoutes from './src/routes/userRoutes.js';
// // import leadRoutes from './src/routes/leadRoutes.js';
// // // ✅ 1. Import the new role routes
// // import roleRoutes from './src/routes/roleRoutes.js';
// // import followUpHistoryRoutes from './src/routes/followUpHistory.routes.js';
// // import authRoutes from './routes/auth.routes.js'; // Import the new auth routes

// // // Load environment variables
// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Middleware
// // app.use(cors()); // Enable Cross-Origin Resource Sharing
// // app.use(express.json()); // Allow the server to accept JSON in the request body
// // app.use(express.urlencoded({ extended: true })); // Allow the server to accept URL-encoded forms

// // // API Routes

// // app.use('/api/auth', authRoutes);
// // app.use('/api/leads', leadRoutes);
// // app.use('/api', userRoutes);
// // app.use('/api', roleRoutes);
// // app.use('/api/leads', followUpHistoryRoutes);


// // // Simple root route
// // app.get('/', (req, res) => {
// //   res.send('Backend server is running!');
// // });

// // // Start the server
// // app.listen(PORT, () => {
// //   console.log(`Server is running on http://localhost:${PORT}`);
// // });

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import userRoutes from './src/routes/userRoutes.js';
// import leadRoutes from './src/routes/leadRoutes.js';
// import roleRoutes from './src/routes/roleRoutes.js';
// import followUpHistoryRoutes from './src/routes/followUpHistory.routes.js';

// // ✅ FIX: The path was missing the 'src' directory.
// import authRoutes from './src/routes/auth.routes.js'; 

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors()); 
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

// // API Routes
// app.use('/api/auth', authRoutes); // This will now work
// app.use('/api/leads', leadRoutes);
// app.use('/api', userRoutes);
// app.use('/api', roleRoutes);
// app.use('/api/leads', followUpHistoryRoutes);

// // Simple root route
// app.get('/', (req, res) => {
//   res.send('Backend server is running!');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';
import roleRoutes from './src/routes/roleRoutes.js';
import followUpHistoryRoutes from './src/routes/followUpHistory.routes.js';
import authRoutes from './src/routes/auth.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define allowed origins here
const allowedOrigins = [
  "http://localhost:8080",          // local frontend dev
  "http://10.126.217.232:8080",     // local network dev
  "https://lead-listing.vercel.app" // deployed frontend
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
app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api/leads', followUpHistoryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
