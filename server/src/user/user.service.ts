import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CoursesRepository } from 'src/courses/courses.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  //   async updateProgress(userId: string, courseUrl: string, nextStep: number) {
  //     return await this.userRepository.updateProgress(
  //       userId,
  //       courseUrl,
  //       nextStep,
  //     );
  //   }
}
