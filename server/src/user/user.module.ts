import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => CoursesModule),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
