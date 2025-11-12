import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  userId: string;
  userName: string;
  phoneNumber?: string;
  messages: {
    sender: "user" | "admin";
    text: string;
    time: Date;
  }[];
  lastMessage?: string;  // 🆕 Último mensaje mostrado
  time?: Date;           // 🆕 Hora del último mensaje
  status: "pending" | "active" | "closed";
  startedAt: Date;
}

const MessageSchema = new Schema({
  sender: { type: String, enum: ["user", "admin"], required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  phoneNumber: { type: String },
  messages: { type: [MessageSchema], default: [] },
  lastMessage: { type: String }, // 🆕 Nuevo campo
  time: { type: Date },          // 🆕 Nuevo campo
  status: { type: String, enum: ["pending", "active", "closed"], default: "pending" },
  startedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
