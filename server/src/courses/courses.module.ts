import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseSchema } from './entities/course.entity';
import { CoursesRepository } from './courses.repository';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    KafkaModule,
  ],
  providers: [CoursesService, CoursesRepository],
  controllers: [CoursesController],
})
export class CoursesModule {}
