import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('message')
@Injectable()
export class MessageConsumer extends WorkerHost {
  private readonly logger = new Logger(MessageConsumer.name);
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { messageId } = job.data as { messageId: string };
    this.logger.log(`Simulating send for message ${messageId}`);
    await this.prisma.message.update({ where: { id: messageId }, data: { status: 'PROCESSING' } });
    // Simulate external API latency
    await new Promise((r) => setTimeout(r, 500));
    // Random success/failure simulation
    const success = Math.random() > 0.1;
    if (success) {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { status: 'SENT', sentAt: new Date(), error: null },
      });
      this.logger.log(`Message ${messageId} SENT`);
    } else {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { status: 'FAILED', error: 'Simulated failure' },
      });
      this.logger.warn(`Message ${messageId} FAILED`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }
}


