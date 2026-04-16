import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "./models/UserModel";
import { CarModel } from "./models/CarModel";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const adminExists = await UserModel.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await UserModel.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      });
    }

    const carCount = await CarModel.countDocuments();
    if (carCount === 0) {
      await CarModel.insertMany([
        { make: "Toyota", model: "Corolla", plateNumber: "ABC123", status: "AVAILABLE" },
        { make: "Honda", model: "Civic", plateNumber: "XYZ789", status: "AVAILABLE" },
        { make: "Ford", model: "Escape", plateNumber: "LMN456", status: "MAINTENANCE" }
      ]);
    }

    console.log("Seed completed");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error);
  }
};

seed();