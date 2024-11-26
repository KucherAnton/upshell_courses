import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':url')
  findOne(@Param('url') url: string) {
    return this.coursesService.findOne(url);
  }

  @Patch(':url')
  update(@Param('url') url: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(url, updateCourseDto);
  }

  @Delete(':url')
  remove(@Param('url') url: string) {
    return this.coursesService.remove(url);
  }
}
