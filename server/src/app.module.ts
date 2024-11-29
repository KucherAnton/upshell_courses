import { Module, OnModuleInit } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import * as dotenv from 'dotenv';
import { KafkaModule } from './kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MockService } from './mock/mock.service';
import { MockModule } from './mock/mock.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://KucherAnton:D4xChdNU@cluster.mcery.mongodb.net/?retryWrites=true&w=majority&appName=Cluster',
    ),
    CoursesModule,
    KafkaModule,
    UserModule,
    MockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private mockDataService: MockService) {}

  async onModuleInit() {
    await this.mockDataService.seedDatabase();
  }
}
