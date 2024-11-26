import { Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesRepository {
  constructor(@InjectModel('Course') private courseModel: Model<Course>) {}

  async findByCourseUrl(url: string): Promise<Course | null> {
    return this.courseModel.findOne({ url }).exec();
  }

  async updateCourseStatusToInProgress(courseId: string): Promise<Course> {
    return this.courseModel
      .findByIdAndUpdate(courseId, { status: 'IN_PROGRESS' }, { new: true })
      .exec();
  }
}
