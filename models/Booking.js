import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  bookingDate: { type: Date, required: true },
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);
