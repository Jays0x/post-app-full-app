import { Schema, model, models } from 'mongoose';
import mongoose from 'mongoose';

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, required: false },
  verificationCodeExpires: { type: Date, required: false }, 
}, {
  timestamps: true,
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
