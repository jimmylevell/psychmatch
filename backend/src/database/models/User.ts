import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export enum UserRole {
  ADMINISTRATOR = 'administrator',
  PSYCHOLOGIST = 'psychologist'
}

export interface IUser extends MongooseDocument {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

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
