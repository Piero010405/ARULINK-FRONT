import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: "user" | "bot" | "admin";
  text: string;
  timestamp: Date;
  expiresAt: Date;
  read: boolean;
}

const messageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: String, enum: ["user", "bot", "admin"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 semana
  },
  read: { type: Boolean, default: false },
});

// TTL index → elimina mensajes después de 1 semana
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
