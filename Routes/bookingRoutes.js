import express from "express";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { verifyToken } from "../utils/firebaseAuth.js";
const router = express.Router();

// Create booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const { serviceId, bookingDate, price } = req.body;
    const svc = await Service.findById(serviceId);
    if (!svc) return res.status(404).json({ error: "Service not found" });
    if (svc.providerEmail === req.user.email) return res.status(400).json({ error: "Cannot book own service" });

    const booking = new Booking({
      userEmail: req.user.email,
      serviceId,
      bookingDate,
      price
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get bookings for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const email = req.query.email || req.user.email;
    const bookings = await Booking.find({ userEmail: email }).populate("serviceId");
    res.json(bookings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cancel booking
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) return res.status(404).json({ error: "Not found" });
    if (b.userEmail !== req.user.email) return res.status(403).json({ error: "Forbidden" });
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Cancelled" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
