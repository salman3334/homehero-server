import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userEmail: String,
  userName: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true },
  description: String,
  image: String,
  providerName: String,
  providerEmail: String,
  reviews: [reviewSchema]
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
