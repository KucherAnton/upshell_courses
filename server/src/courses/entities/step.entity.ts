import { Schema, model } from 'mongoose';
import { TranslatableFieldSchema } from './course.entity';
import { Step } from 'src/common/constants/interfaces';

const QuizAnswerSchema = new Schema(
  {
    quiz_answer_number: { type: Number, required: true, min: 1, max: 10 },
    quiz_answer: {
      type: TranslatableFieldSchema,
      required: true,
      maxLength: 1000,
    },
    is_correct: { type: Boolean, required: true },
  },
  {
    _id: false,
  },
);

const QuizSchema = new Schema({
  quiz_type: {
    type: String,
    enum: ['ONE_ANSWER', 'MULTICHOICE'],
    required: true,
  },
  quiz_question: {
    type: TranslatableFieldSchema,
    required: true,
    maxLength: 1000,
  },
  quiz_answers: [QuizAnswerSchema],
});

const StepContentSchema = new Schema(
  {
    theory: { type: TranslatableFieldSchema, default: null },
    quiz: { type: [QuizSchema], default: null },
    practice: { type: TranslatableFieldSchema, default: null },
  },
  { _id: false },
);

export const StepSchema = new Schema<Step>({
  step_number: { type: Number, required: true, min: 1 },
  step_type: {
    type: String,
    enum: ['THEORY', 'QUIZ', 'PRACTICE'],
    required: true,
  },
  step_status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'DONE'],
    required: true,
  },
  step_content: { type: StepContentSchema, required: true },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
  },
});

export const StepModel = model('Step', StepSchema);
