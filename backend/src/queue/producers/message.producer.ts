import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MessageProducer {
  constructor(@InjectQueue('message') private readonly queue: Queue) {}

  enqueueSend(messageId: string) {
    return this.queue.add('send', { messageId }, { removeOnComplete: true });
  }
}


