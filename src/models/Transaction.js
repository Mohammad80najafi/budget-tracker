import mongoose from "mongoose";

import User from "./User";

import { categories } from "../lib/constants";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], default: "expense" },
    title: { type: String, default: "" },
    category: {
      type: String,
      enum: Object.keys(categories),
      default: "other",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  mongoose.models?.Transaction || mongoose.model("Transaction", schema);

export default Transaction;
