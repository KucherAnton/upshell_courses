import { Schema, Document } from 'mongoose';

export interface Course extends Document {
  name: string;
  url: string;
  status: string;
}

export const CourseSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  status: { type: String, default: 'NOT_STARTED' },
});
