import { model, Schema } from 'mongoose';
import { Course, CourseContentsPiece } from 'src/common/constants/interfaces';

export const TranslatableFieldSchema = new Schema(
  {
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  { _id: false },
);

const CourseContentSchema = new Schema<CourseContentsPiece>(
  {
    contents_level: { type: String, required: true, min: 1, max: 5 },
    contents_name: {
      type: TranslatableFieldSchema,
      required: true,
      maxlength: 200,
    },
    step: { type: Schema.Types.ObjectId, ref: 'Step', default: null },
  },
  { _id: false },
);

export const CourseSchema = new Schema<Course>(
  {
    course_name_url: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: 100,
      match: /^[a-z\-0-9]+$/,
    },
    course_difficulty_level: { type: Number, required: true, min: 0, max: 2 },
    course_fee: { type: String, enum: ['FREE', 'PAID'], required: true },
    course_amount_of_lessons: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    course_amount_of_tasks: { type: Number, required: true, min: 0, max: 1000 },
    course_amount_of_quizzes: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    course_duration_of_learning_hours: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    course_image_uri: { type: String, required: true },
    course_topics: [{ type: Schema.Types.ObjectId, ref: 'CourseTopic' }],
    course_status: {
      type: String,
      enum: ['ANNOUNCED', 'ACTIVE', 'ARCHIVED'],
      required: true,
      index: true,
    },
    course_name: { type: TranslatableFieldSchema, required: true, index: true },
    course_short_description: {
      type: TranslatableFieldSchema,
      required: true,
      maxlength: 5000,
    },
    course_long_description: {
      type: TranslatableFieldSchema,
      required: true,
      maxLength: 20000,
    },
    contents: [CourseContentSchema],
  },
  { _id: true },
);

export const CourseModel = model('Course', CourseSchema);
