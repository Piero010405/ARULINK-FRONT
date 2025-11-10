import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user";

const MONGODB_URI = "mongodb+srv://sniper201665_db_user:HCWuytQ4TUHQbtuD@arulinkdb.r3emnk6.mongodb.net/arulinkdb?retryWrites=true&w=majority";

(async () => {
  try {
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
