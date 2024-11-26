import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesRepository } from './courses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CoursesService, CoursesRepository],
  controllers: [CoursesController],
})
export class CoursesModule {}
