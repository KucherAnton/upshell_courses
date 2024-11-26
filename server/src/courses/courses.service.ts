import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { CoursesRepository } from './courses.repository';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async findAll() {
    return this.coursesRepository.find();
  }

  async findOne(url: string) {
    const course = await this.coursesRepository.findByUrl(url);
    if (!course) {
      throw new NotFoundException(`Course with url "${url}" not found`);
    }
    return course;
  }

  async update(url: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(url);
    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  async remove(url: string) {
    const course = await this.findOne(url);
    return this.coursesRepository.remove(course);
  }
}
