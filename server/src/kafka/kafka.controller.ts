import { Controller, Post } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private kafkaService: KafkaService) {}

  @Post('publish')
  async publishMessage() {
    await this.kafkaService.publishMessage('course-start', 'User has started a course!');
    return 'Message sent to Kafka';
  }
}