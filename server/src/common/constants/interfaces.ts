import { Types } from 'mongoose';
import {
  CourseFee,
  CourseStatus,
  QuizType,
  StepStatus,
  StepType,
  UserCourseStatus,
} from './enum';

export interface Course extends Document {
  course_name_url: string; //Max 100, pattern: ^[a-z\-0-9]+$
  course_difficulty_level: number; //Min 0 Max 10
  course_fee: CourseFee; //FREE, PAID
  course_amount_of_lessons: number; //Min 0 Max 1000
  course_amount_of_tasks: number; //Min 0 Max 1000
  course_amount_of_quizzes: number; //Min 0 Max 1000
  course_duration_of_learning_hours: number; //Min 0 Max 1000
  course_image_uri: string;
  course_topics: Types.ObjectId[];
  course_status: CourseStatus; //ANNOUNCED, ACTIVE, ARCHIVED
  course_name: TranslatableField; //Max 200
  course_short_description: TranslatableField; //Max 5000
  course_long_description: TranslatableField; //Max 20000
  contents: CourseContentsPiece[];
}

export interface CourseContentsPiece {
  contents_level: string; //Min 1 Max 5
  contents_name: TranslatableField; //Max 200
  step?: Types.ObjectId | null;
}

export interface Step {
  step_number: number; // Min 1
  step_type: StepType; //THEORY, QUIZ, PRACTICE
  step_status: StepStatus; //NOT_STARTED, IN_PROGRESS, DONE
  step_content: StepContent;
  course_id: Types.ObjectId | null;
}

export interface StepContent {
  theory: TranslatableField | null;
  quiz: Quiz[] | null;
  practice: TranslatableField | null;
}

export interface CourseTopic extends Document {
  course_topic_name: string; //Max 50
  course_topic_status: CourseStatus;
}

export interface Quiz {
  quiz_type: QuizType;
  quiz_question: TranslatableField;
  quiz_answers: QuizAnswer[];
}

export interface QuizAnswer {
  number: number; // Min 1 Max 10
  answer: string; //Max 1000
  is_correct: boolean;
}

export interface User {
  [userId: string]: {
    courses: {
      [courseNameUrl: string]: UserCourse;
    };
  };
}

export interface UserCourse {
  user_course_status: UserCourseStatus;
  last_step_number: number;
  steps: UserStep[];
}

export interface UserStep {
  step_number: number;
  step_status: StepStatus;
}

export interface TranslatableField {
  en: string;
  ru: string;
}
