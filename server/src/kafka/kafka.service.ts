import { Injectable } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('course-start');
    this.client.connect();
  }

  async publishMessage(topic: string, message: string) {
    await this.client.emit(topic, message);
  }

  @MessagePattern('course-start')
  getCourseStart(@Payload() message: any): Observable<any> {
    console.log('Message received from Kafka:', message);
    return message;
  }
}
