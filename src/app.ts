import express from "express";
import dotenv from "dotenv";

import bookingRoutes from "./presentation/routes/bookingRoutes";
import carRoutes from "./presentation/routes/carRoutes";
import authRoutes from "./presentation/routes/authRoutes";

import { connectMongoDB } from "./infrastructure/database/mongoConnection";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Car Booking Backend API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cars", carRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

startServer();