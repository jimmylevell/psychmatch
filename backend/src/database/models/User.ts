import mongoose, { Schema } from 'mongoose';

import { IUser, UserRole } from '../../types';

// define schema for user
const userSchema = new Schema<IUser>({
  _id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.PSYCHOLOGIST
  }
}, {
  collection: 'user',
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
