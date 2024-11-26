import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { KafkaModule } from './kafka/kafka.module';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    CoursesModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
