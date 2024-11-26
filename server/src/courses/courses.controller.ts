import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiTags } from '@nestjs/swagger';
import { Course } from './entities/course.entity';

@ApiTags('Courses')
@Controller('api/v1/users/:user_id/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':url')
  async getCourseInfo(
    @Param('user_id') user_id: string,
    @Param('course_name_url') url: string,
  ) {
    const course = await this.coursesService.getCourseInfo(url);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Post(':course_name_url/start')
  async startCourse(
    @Param('user_id') user_id: string,
    @Param('course_name_url') url: string,
  ): Promise<Course> {
    return this.coursesService.startCourse(url, user_id);
  }
}
