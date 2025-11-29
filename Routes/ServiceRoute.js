import express from "express";
import Service from "../models/Service.js";
import { verifyToken } from "../utils/firebaseAuth.js";
const router = express.Router();

// Create service (provider)
router.post("/", verifyToken, async (req, res) => {
  try {
    const payload = { ...req.body, providerEmail: req.user.email || req.body.providerEmail };
    const svc = new Service(payload);
    await svc.save();
    res.status(201).json(svc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get services (all or provider)
router.get("/", async (req, res) => {
  try {
    const { email, minPrice, maxPrice, search } = req.query;
    const q = {};
    if (email) q.providerEmail = email;
    if (minPrice || maxPrice) q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
    if (search) q.$or = [{ name: new RegExp(search, "i") }, { category: new RegExp(search, "i") }];
    const services = await Service.find(q).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single service
router.get("/:id", async (req, res) => {
  try {
    const s = await Service.findById(req.params.id);
    res.json(s);
  } catch (err) { res.status(404).json({ error: "Not found" }); }
});

// Update service (only provider)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ error: "Not found" });
    if (svc.providerEmail !== req.user.email) return res.status(403).json({ error: "Forbidden" });
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete service (only provider)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ error: "Not found" });
    if (svc.providerEmail !== req.user.email) return res.status(403).json({ error: "Forbidden" });
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
