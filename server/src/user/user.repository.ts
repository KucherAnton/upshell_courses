import { InjectModel } from '@nestjs/mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CoursesRepository } from 'src/courses/courses.repository';
import { User, UserCourse } from 'src/common/constants/interfaces';
import { UserModel } from './entities/user.entity';
import { UserCourseStatus } from 'src/common/constants/enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @Inject(forwardRef(() => CoursesRepository))
    private coursesRepository: CoursesRepository,
  ) {}

  async findUserById(userId: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ [`users.${userId}`]: { $exists: true } })
      .exec();
    return user;
  }

  async save(user: User): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        {},
        { $set: { users: user.users } },
        { upsert: true, new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new Error('Failed to save or update user');
    }

    return updatedUser.toObject() as User;
  }

  async findByUserAndCourse(
    userId: string,
    courseNameUrl: string,
  ): Promise<UserCourse | null> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userCourses = user.users[userId].courses;
    if (!userCourses) {
      throw new Error('Courses not found for user');
    }

    const course = userCourses[courseNameUrl];
    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  async updateCourseStatus(
    userId: string,
    courseNameUrl: string,
    status: string,
  ): Promise<void> {
    const updatePath = `users.${userId}.courses.${courseNameUrl}.user_course_status`;
    await this.userModel
      .updateOne(
        { [`users.${userId}.courses.${courseNameUrl}`]: { $exists: true } },
        { $set: { [updatePath]: status } },
      )
      .exec();
  }

  async updateProgress(
    userId: string,
    courseNameUrl: string,
    nextStep: number,
  ) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userCourses = user.users[userId].courses;
    if (!userCourses) {
      throw new Error('Courses not found for user');
    }

    const userCourse = userCourses[courseNameUrl];
    if (!userCourse) {
      throw new Error('Course not found for user');
    }

    const course = await this.coursesRepository.findByCourseId(courseNameUrl);
    if (!course || !course.contents[courseNameUrl]) {
      throw new Error('Course steps not found');
    }

    userCourse.last_step_number = nextStep;

    if (nextStep === course.contents.length) {
      userCourse.user_course_status = UserCourseStatus.FINISHED;
    }

    await this.save(user);
  }
}
