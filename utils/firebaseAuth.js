import admin from "firebase-admin";

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // contains uid, email, etc.
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    res.status(403).json({ error: "Forbidden" });
  }
};
