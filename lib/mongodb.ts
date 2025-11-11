import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("⚠️ No se encontró MONGODB_URI en .env.local");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB ya está conectado");
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
}
