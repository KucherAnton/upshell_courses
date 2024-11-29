import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseStatus } from 'src/common/constants/enum';
import {
  Course,
  CourseTopic,
  Step,
  User,
} from 'src/common/constants/interfaces';

@Injectable()
export class MockService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('CourseTopic') private courseTopicModel: Model<CourseTopic>,
    @InjectModel('Step') private stepModel: Model<Step>,
  ) {}

  async seedDatabase() {
    await this.userModel.deleteMany({});
    await this.courseModel.deleteMany({});
    await this.courseTopicModel.deleteMany({});
    await this.stepModel.deleteMany({});

    const mockSteps = await this.stepModel.insertMany([
      {
        step_number: 1,
        step_type: 'THEORY',
        step_status: 'DONE',
        step_content: {
          theory: {
            en: 'Introduction to Python programming',
            ru: 'Введение в программирование на Python',
          },
          quiz: null,
          practice: null,
        },
        course_id: null,
      },
      {
        step_number: 2,
        step_type: 'QUIZ',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: null,
          quiz: [
            {
              quiz_type: 'ONE_ANSWER',
              quiz_question: { en: 'What is Python?', ru: 'Что такое Python?' },
              quiz_answers: [
                {
                  quiz_answer_number: 1,
                  quiz_answer: {
                    en: 'A programming language',
                    ru: 'Язык программирования',
                  },
                  is_correct: true,
                },
                {
                  quiz_answer_number: 2,
                  quiz_answer: { en: 'A framework', ru: 'Фреймворк' },
                  is_correct: false,
                },
              ],
            },
          ],
          practice: null,
        },
        course_id: null,
      },
      {
        step_number: 3,
        step_type: 'PRACTICE',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: null,
          quiz: null,
          practice: {
            en: 'Write a simple Python script to print "Hello World".',
            ru: 'Напишите простой скрипт Python, чтобы вывести "Hello World".',
          },
        },
        course_id: null,
      },
      {
        step_number: 4,
        step_type: 'THEORY',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: { en: 'Python data types', ru: 'Типы данных в Python' },
          quiz: null,
          practice: null,
        },
        course_id: null,
      },

      {
        step_number: 5,
        step_type: 'QUIZ',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: null,
          quiz: [
            {
              quiz_type: 'MULTICHOICE',
              quiz_question: {
                en: 'Which of these are Python data types?',
                ru: 'Какие из этих типов данных есть в Python?',
              },
              quiz_answers: [
                {
                  quiz_answer_number: 1,
                  quiz_answer: { en: 'Integer', ru: 'Целое число' },
                  is_correct: true,
                },
                {
                  quiz_answer_number: 2,
                  quiz_answer: { en: 'String', ru: 'Строка' },
                  is_correct: true,
                },
                {
                  quiz_answer_number: 3,
                  quiz_answer: { en: 'Array', ru: 'Массив' },
                  is_correct: false,
                },
              ],
            },
          ],
          practice: null,
        },
        course_id: null,
      },
      {
        step_number: 6,
        step_type: 'PRACTICE',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: null,
          quiz: null,
          practice: {
            en: 'Create a Python list with five elements and print it.',
            ru: 'Создайте список в Python из пяти элементов и выведите его.',
          },
        },
        course_id: null,
      },
      {
        step_number: 7,
        step_type: 'THEORY',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: {
            en: 'Python control structures',
            ru: 'Управляющие структуры Python',
          },
          quiz: null,
          practice: null,
        },
        course_id: null,
      },
      {
        step_number: 8,
        step_type: 'QUIZ',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: null,
          quiz: [
            {
              quiz_type: 'ONE_ANSWER',
              quiz_question: {
                en: 'What is the purpose of a loop in Python?',
                ru: 'Какова цель цикла в Python?',
              },
              quiz_answers: [
                {
                  quiz_answer_number: 1,
                  quiz_answer: { en: 'To repeat code', ru: 'Повторить код' },
                  is_correct: true,
                },
                {
                  quiz_answer_number: 2,
                  quiz_answer: {
                    en: 'To create functions',
                    ru: 'Создавать функции',
                  },
                  is_correct: false,
                },
              ],
            },
          ],
          practice: null,
        },
        course_id: null,
      },
      {
        step_number: 9,
        step_type: 'PRACTICE',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: null,
          quiz: null,
          practice: {
            en: 'Write a Python loop that prints numbers 1 to 10.',
            ru: 'Напишите цикл Python, который выводит числа от 1 до 10.',
          },
        },
        course_id: null,
      },
      {
        step_number: 10,
        step_type: 'THEORY',
        step_status: 'NOT_STARTED',
        step_content: {
          theory: {
            en: 'Working with Python functions',
            ru: 'Работа с функциями Python',
          },
          quiz: null,
          practice: null,
        },
        course_id: null,
      },
    ]);

    const mockTopics = await this.courseTopicModel.insertMany([
      {
        course_topic_name: 'Python Basics',
        course_topic_status: CourseStatus.ACTIVE,
      },
      {
        course_topic_name: 'JavaScript Fundamentals',
        course_topic_status: CourseStatus.ARCHIVED,
      },
      {
        course_topic_name: 'Asynchronous Programming',
        course_topic_status: CourseStatus.ACTIVE,
      },
      {
        course_topic_name: 'Web Development',
        course_topic_status: CourseStatus.ACTIVE,
      },
    ]);

    const mockCourses = await this.courseModel.insertMany([
      {
        course_name_url: 'introduction-to-python',
        course_difficulty_level: 1,
        course_fee: 'FREE',
        course_amount_of_lessons: 10,
        course_amount_of_tasks: 5,
        course_amount_of_quizzes: 2,
        course_duration_of_learning_hours: 15,
        course_image_uri: 'http://example.com/python-course-image.jpg',
        course_topics: [mockTopics[0]._id, mockTopics[2]._id],
        course_status: 'ACTIVE',
        course_name: { en: 'Introduction to Python', ru: 'Введение в Python' },
        course_short_description: {
          en: 'Learn the basics of Python programming.',
          ru: 'Изучите основы программирования на Python.',
        },
        course_long_description: {
          en: 'This course covers Python basics, including syntax, data structures, and simple algorithms.',
          ru: 'Курс охватывает основы Python, включая синтаксис, структуры данных и простые алгоритмы.',
        },
        contents: [
          {
            contents_level: '1',
            contents_name: { en: 'Introduction', ru: 'Введение' },
            step: mockSteps[0]._id,
          },
          {
            contents_level: '2',
            contents_name: { en: 'Data Types', ru: 'Типы данных' },
            step: mockSteps[1]._id,
          },
        ],
      },
      {
        course_name_url: 'advanced-javascript',
        course_difficulty_level: 2,
        course_fee: 'PAID',
        course_amount_of_lessons: 20,
        course_amount_of_tasks: 10,
        course_amount_of_quizzes: 5,
        course_duration_of_learning_hours: 40,
        course_image_uri: 'http://example.com/javascript-course-image.jpg',
        course_topics: [mockTopics[1]._id, mockTopics[3]._id],
        course_status: 'ACTIVE',
        course_name: {
          en: 'Advanced JavaScript',
          ru: 'Продвинутый JavaScript',
        },
        course_short_description: {
          en: 'Master advanced JavaScript techniques.',
          ru: 'Освойте продвинутые техники JavaScript.',
        },
        course_long_description: {
          en: "This course dives into JavaScript's advanced concepts, such as closures, prototypes, and asynchronous programming.",
          ru: 'Курс углубляется в продвинутые концепции JavaScript, такие как замыкания, прототипы и асинхронное программирование.',
        },
        contents: [
          {
            contents_level: '1',
            contents_name: { en: 'Closures', ru: 'Замыкания' },
            step: null,
          },
          {
            contents_level: '2',
            contents_name: {
              en: 'Asynchronous Programming',
              ru: 'Асинхронное программирование',
            },
            step: null,
          },
        ],
      },
    ]);

    await Promise.all(
      mockSteps.map(async (step, index) => {
        if (index == 0) step.course_id = mockCourses[0]._id;
        if (index == 1) step.course_id = mockCourses[0]._id;
        if (index == 2) step.course_id = mockCourses[0]._id;
        await step.save();
      }),
    );

    const mockUsers = await this.userModel.insertMany([
      {
        courses: {
          'introduction-to-python': {
            user_course_status: 'IN_PROGRESS',
            last_step_number: 17,
            steps: [
              { step_number: 1, step_status: 'DONE' },
              { step_number: 2, step_status: 'IN_PROGRESS' },
              { step_number: 3, step_status: 'NOT_STARTED' },
              { step_number: 4, step_status: 'NOT_STARTED' },
            ],
          },
          'advanced-javascript': {
            user_course_status: 'FINISHED',
            last_step_number: 24,
            steps: [
              { step_number: 1, step_status: 'DONE' },
              { step_number: 2, step_status: 'DONE' },
              { step_number: 3, step_status: 'DONE' },
            ],
          },
        },
      },
      {
        courses: {
          'introduction-to-python': {
            user_course_status: 'IN_PROGRESS',
            last_step_number: 5,
            steps: [
              { step_number: 1, step_status: 'DONE' },
              { step_number: 2, step_status: 'DONE' },
              { step_number: 3, step_status: 'IN_PROGRESS' },
              { step_number: 4, step_status: 'NOT_STARTED' },
              { step_number: 5, step_status: 'NOT_STARTED' },
            ],
          },
        },
      },
      {
        courses: {
          'advanced-javascript': {
            user_course_status: 'FINISHED',
            last_step_number: 30,
            steps: [
              { step_number: 1, step_status: 'DONE' },
              { step_number: 2, step_status: 'DONE' },
              { step_number: 3, step_status: 'DONE' },
              { step_number: 4, step_status: 'DONE' },
            ],
          },
          'introduction-to-python': {
            user_course_status: 'IN_PROGRESS',
            last_step_number: 12,
            steps: [
              { step_number: 1, step_status: 'DONE' },
              { step_number: 2, step_status: 'IN_PROGRESS' },
              { step_number: 3, step_status: 'NOT_STARTED' },
            ],
          },
        },
      },
    ]);
    console.log('Mock data have been added to the database.');
  }
}
