/* this is my backend server code, currently stage aim to store and verified the login and signup function, further will devided
into multiple brachces like the data form the main management function, includes the material, cost, time, etc.
and I might move this codes into another script named apps or subroute, to better manage this data, which is quite important.
Meanwhile, to secure the data base is a critical jobs to do in the furture.
*/
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const helmet = require('helmet'); // Import helmet
require('dotenv').config();

const app = express();
const PORT = 3000; // Numbers of portal

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Secure HTTP headers using helmet
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
