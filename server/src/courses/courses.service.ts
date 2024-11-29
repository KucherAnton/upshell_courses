import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { Course } from '../common/constants/interfaces';
import { KafkaService } from 'src/kafka/kafka.service';
import { UserRepository } from 'src/user/user.repository';
import { Step } from '../common/constants/interfaces';
import { UserCourseStatus } from 'src/common/constants/enum';
import { FilterParams } from 'src/common/filters/course.filter';

@Injectable()
export class CoursesService {
  constructor(
    private coursesRepository: CoursesRepository,
    private kafkaService: KafkaService,
    private userRepository: UserRepository,
  ) {}

  async getCourses(filters: FilterParams) {
    const {
      level,
      fee,
      topic,
      status,
      search,
      offset = 0,
      limit = 10,
    } = filters;

    const query: Record<string, any> = {};

    if (level) {
      const levels = level.split(',').map(Number);
      query.course_difficulty_level = { $in: levels };
    }

    if (fee) {
      query.course_fee = fee;
    }

    if (topic) {
      const topics = topic.split(',');
      query.course_topics = { $in: topics };
    }

    if (status) {
      const statuses = status.split(',');
      query.course_status = { $in: statuses };
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { 'course_name.en': regex },
        { 'course_name.ru': regex },
        { 'course_short_description.en': regex },
        { 'course_short_description.ru': regex },
      ];
    }

    return this.coursesRepository.getCourses(query, offset, limit);
  }

  async getCourseInfo(
    courseId: string,
    userId: string,
  ): Promise<Course | null> {
    let course = await this.coursesRepository.findByCourseId(courseId);
    if (!course) {
      throw new Error('Курс не найден');
    }
    return course;
  }

  async startCourse(url: string, userId: string): Promise<Course> {
    const course = await this.coursesRepository.findByCourseId(url);

    if (!course) {
      throw new Error(`Курс с url ${url} не найден`);
    }

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }

    const existingCourse = user.users[userId].courses[url];

    if (existingCourse) {
      if (existingCourse.user_course_status !== 'IN_PROGRESS') {
        existingCourse.user_course_status = UserCourseStatus.IN_PROGRESS;
        await this.userRepository.save(user);
      }
    } else {
      // user.courses[url] = {
      //   user_course_status: UserCourseStatus.IN_PROGRESS,
      //   last_step_number: 1,
      //   // steps: course.contents[0].step,
      // };
      await this.userRepository.save(user);
    }

    try {
      await this.kafkaService.publishMessage(
        'course_started',
        JSON.stringify({
          userId,
          course_name: course.course_name,
        }),
      );
    } catch (error) {
      console.error('Ошибка при публикации события в Kafka:', error);
      throw new Error('Ошибка при публикации события в Kafka');
    }

    return course;
  }

  async markCourseAsDone(courseId: string, userId: string): Promise<any> {
    const userCourse = await this.userRepository.findByUserAndCourse(
      userId,
      courseId,
    );

    if (!userCourse || userCourse.user_course_status !== 'IN_PROGRESS') {
      throw new BadRequestException(
        'Course is not in progress or not started yet',
      );
    }

    await this.userRepository.updateCourseStatus(userId, courseId, 'COMPLETED');

    await this.kafkaService.publishMessage(
      'course_completed',
      JSON.stringify({ userId, courseId }),
    );

    return { message: 'Course marked as completed successfully' };
  }

  async getLesson(url: string, userId: string, stepNumber: number) {
    const userCourse = await this.userRepository.findByUserAndCourse(
      userId,
      url,
    );

    const step = userCourse.steps.find((s) => s.step_number == stepNumber);
    if (!step) {
      throw new NotFoundException('Step not found');
    }

    return step;
  }

  // async checkQuizAnswers(
  //   url: string,
  //   userId: string,
  //   stepNumber: number,
  //   userAnswers: string[],
  // ): Promise<{ correct: boolean; correctAnswers: string[] }> {
  //   const userCourse = await this.userRepository.findByUserAndCourse(
  //     userId,
  //     url,
  //   );

  //   if (!userCourse) throw new Error("You don't have this course");

  //   const course = await this.coursesRepository.findByCourseId(url);

  //   const step = course.contents.find((s) => s.step_number === stepNumber);
  //   if (!step || step.stepType !== 'QUIZ') {
  //     throw new NotFoundException('Quiz not found');
  //   }

  //   const correctAnswers = step.correctAnswers;

  //   const correct = correctAnswers.every((answer, index) =>
  //     userAnswers[index] ? userAnswers[index] === answer : false,
  //   );

  //   const result = { correct, correctAnswers };

  //   await this.kafkaService.publishMessage(
  //     'quiz_result',
  //     JSON.stringify({
  //       userId: userId,
  //       courseNameUrl: url,
  //       stepNumber,
  //       result,
  //     }),
  //   );

  //   return result;
  // }

  async goToNextStep(url: string, userId: string, stepNumber: number) {
    const userCourse = await this.userRepository.findByUserAndCourse(
      userId,
      url,
    );
    if (!userCourse) {
      throw new BadRequestException('User is not enrolled in the course');
    }

    const course = await this.coursesRepository.findByCourseId(url);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const totalSteps = course.contents.length;
    if (stepNumber >= totalSteps) {
      throw new NotFoundException('No more steps available');
    }

    const nextStepIndex = stepNumber;
    const nextStep = course.contents[nextStepIndex].step;
    if (!nextStep) {
      throw new BadRequestException('Next step not found');
    }

    // await this.userRepository.updateProgress(userId, url, nextStep.stepNumber);

    await this.kafkaService.publishMessage(
      'course_step_next',
      JSON.stringify({
        userId,
        courseNameUrl: url,
        currentStep: stepNumber,
        nextStep,
      }),
    );

    return { nextStep };
  }

  async getCourseContents(userId: string, url: string) {
    const userCourse = await this.userRepository.findByUserAndCourse(
      userId,
      url,
    );

    if (!userCourse) {
      throw new BadRequestException('There is no course');
    }

    const course = await this.coursesRepository.findByCourseId(url);

    const completedSteps = userCourse.last_step_number || [];

    // const steps = course.steps.map((step) => ({
    //   stepNumber: step.stepNumber,
    //   completed: completedSteps.includes(step.stepNumber),
    // }));

    // return { description: course.description, steps };
  }
}
