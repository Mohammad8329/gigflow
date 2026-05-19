import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Configure Environment Setup
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect into MongoDB Data Engine
connectDB();

// Global Middleware Config
app.use(cors());
app.use(express.json()); // Parses incoming json payloads safely

// Standard Base Check Root Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "ServiceHive Backend API Running Smoothly."
  });
});

// Start Server Listen
app.listen(PORT, () => {
  console.log(`📡 Application Server actively listening on port: ${PORT}`);
});