import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    carId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED"],
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);

export const BookingModel = model("Booking", bookingSchema);