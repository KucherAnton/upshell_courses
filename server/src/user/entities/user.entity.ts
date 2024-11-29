import { Schema, model } from 'mongoose';
import { User } from 'src/common/constants/interfaces';

const UserStepSchema = new Schema({
  step_number: { type: Number, required: true, min: 1 },
  step_status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'DONE'],
    required: true,
  },
});

const UserCourseSchema = new Schema({
  user_course_status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'FINISHED'],
    required: true,
  },
  last_step_number: { type: Number, required: true, min: 1 },
  steps: [UserStepSchema],
});

const UserCoursesSchema = new Schema({
  type: Map,
  of: UserCourseSchema,
});

export const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  courses: {
    type: Map,
    of: UserCourseSchema,
  },
});

export const UserModel = model<User & Document>('User', UserSchema);
