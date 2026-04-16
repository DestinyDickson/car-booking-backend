import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["GUEST", "REGISTERED", "ADMIN"],
      default: "REGISTERED",
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);