import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '../common/constants/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    private userRepository: UserRepository,
  ) {}

  async getCourses(query: Record<string, any>, offset: number, limit: number) {
    return this.courseModel.find(query).skip(offset).limit(limit).exec();
  }

  async findByCourseId(courseId: string): Promise<Course | null> {
    return await this.courseModel.findById(courseId).exec();
  }

  async updateCourseStatusToInProgress(courseId: string): Promise<Course> {
    return this.courseModel
      .findByIdAndUpdate(courseId, { status: 'IN_PROGRESS' }, { new: true })
      .exec();
  }

  async updateUserProgress(
    userId: string,
    courseUrl: string,
    nextStep: number,
  ): Promise<void> {
    const progress = await this.userRepository.findByUserAndCourse(
      userId,
      courseUrl,
    );
    if (!progress) {
      throw new NotFoundException('User course progress not found');
    }

    // await this.userRepository.updateProgress(userId, courseUrl, nextStep);
  }
}
