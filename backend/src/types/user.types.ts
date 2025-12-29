import mongoose, { Document as MongooseDocument } from 'mongoose';

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
