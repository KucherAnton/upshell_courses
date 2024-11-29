import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiTags } from '@nestjs/swagger';
import { Course } from '../common/constants/interfaces';
import { FilterParams } from 'src/common/filters/course.filter';

@ApiTags('Courses')
@Controller('api/v1/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourses(@Query() filters: FilterParams) {
    return this.coursesService.getCourses(filters);
  }

  @Get(':url')
  async getCourseInfo(
    @Param('url') url: string,
    @Param('user_id') user_id: string,
  ) {
    const course = await this.coursesService.getCourseInfo(url, user_id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  @Post(':url/start')
  async startCourse(
    @Param('user_id') userId: string,
    @Param('url') url: string,
  ): Promise<Course> {
    return this.coursesService.startCourse(url, userId);
  }

  @Post(':url/done')
  async markCourseAsDone(
    @Param('user_id') userId: string,
    @Param('url') url: string,
  ) {
    return this.coursesService.markCourseAsDone(url, userId);
  }

  @Get(':url/steps/:stepNumber')
  async getLesson(
    @Param('user_id') user_id: string,
    @Param('url') url: string,
    @Param('stepNumber') stepNumber: number,
  ) {
    return this.coursesService.getLesson(url, user_id, stepNumber);
  }

  @Post(':url/steps/:stepNumber/quiz')
  async submitQuizAnswer(
    @Param('user_id') user_id: string,
    @Param('url') url: string,
    @Param('stepNumber', ParseIntPipe) stepNumber: number,
    @Body() answersDto: { answers: string[] },
  ) {
    // return this.coursesService.checkQuizAnswers(
    //   url,
    //   user_id,
    //   stepNumber,
    //   answersDto.answers,
    // );
  }

  @Post(':url/steps/:step_number/next')
  async goToNextStep(
    @Param('user_id') user_id: string,
    @Param('url') url: string,
    @Param('step_number') stepNumber: string,
  ) {
    const result = await this.coursesService.goToNextStep(
      url,
      user_id,
      Number(stepNumber),
    );
    return result;
  }

  // @Get(':url/contents')
  // async getCourseContents(
  //   @Param('user_id') userId: string,
  //   @Param('url') url: string,
  // ): Promise<{ steps: { stepNumber: number; completed: boolean }[] }> {
  //   return this.coursesService.getCourseContents(userId, url);
  // }
}
