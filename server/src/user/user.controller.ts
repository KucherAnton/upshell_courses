import { Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @Post(':userId/courses/:courseUrl/steps/:nextStep')
  //   async updateProgress(
  //     @Param('userId') userId: string,
  //     @Param('courseUrl') courseUrl: string,
  //     @Param('nextStep') nextStep: number,
  //   ) {
  //     return await this.userService.updateProgress(userId, courseUrl, nextStep);
  //   }
}
