import { Schema, model } from "mongoose";

const carSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "MAINTENANCE"],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

export const CarModel = model("Car", carSchema);