import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user";

const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("⚠️ No se encontró MONGODB_URI en .env.local");
    }

    await mongoose.connect(MONGODB_URI);
    const hashed = await bcrypt.hash("Password123!", 10);
    const user = await User.create({
      email: "admin@local.com",
      username: "admin",
      password: hashed,
    });
    console.log("✅ Usuario admin creado:", user);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creando usuario:", error);
    process.exit(1);
  }
})();
