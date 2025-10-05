import mongoose, { Schema, models } from 'mongoose';

const blacklistUserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.BlacklistUsers ||
  mongoose.model('BlacklistUsers', blacklistUserSchema);
