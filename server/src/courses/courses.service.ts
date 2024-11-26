import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class CoursesService {
  constructor(
    private coursesRepository: CoursesRepository,
    private kafkaService: KafkaService,
  ) {}

  async getCourseInfo(url: string): Promise<Course | null> {
    let course = this.coursesRepository.findByCourseUrl(url);
    if (!course) {
      throw new Error('Курс не найден');
    }
    return course;
  }

  async startCourse(url: string, user_id: string): Promise<Course> {
    const course = await this.coursesRepository.findByCourseUrl(url);

    if (!course) {
      throw new Error(`Курс с URL ${url} не найден`);
    }

    const updatedCourse =
      await this.coursesRepository.updateCourseStatusToInProgress(course.id);

    try {
      await this.kafkaService.publishMessage(
        'course_started',
        JSON.stringify({
          user_id,
          course_id: updatedCourse.id,
          course_name: updatedCourse.name,
        }),
      );
    } catch (error) {
      console.error('Ошибка при публикации события в Kafka:', error);
      throw new Error('Ошибка при публикации события в Kafka');
    }

    return updatedCourse;
  }
}
