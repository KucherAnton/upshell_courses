import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MockService } from './mock.service';
import { CourseSchema } from 'src/courses/entities/course.entity';
import { UserSchema } from 'src/user/entities/user.entity';
import { CourseTopicSchema } from 'src/courses/entities/course-topic.entity';
import { StepSchema } from 'src/courses/entities/step.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'CourseTopic', schema: CourseTopicSchema },
      { name: 'Step', schema: StepSchema },
    ]),
  ],
  providers: [MockService],
  exports: [MockService],
})
export class MockModule {}
