import { forwardRef, Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseSchema } from './entities/course.entity';
import { CoursesRepository } from './courses.repository';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    KafkaModule,
    forwardRef(() => UserModule),
  ],
  providers: [CoursesService, CoursesRepository],
  controllers: [CoursesController],
  exports: [CoursesModule, CoursesRepository],
})
export class CoursesModule {}
