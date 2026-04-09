import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
 
 


// Create an Express application
const app = express()

// Connect to the database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', (req, res) => 
    res.send("Server is running")
)
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`))