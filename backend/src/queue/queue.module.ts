import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessageConsumer } from './consumers/message.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
        db: Number(process.env.REDIS_DB || 0),
      },
    }),
    BullModule.registerQueue({ name: 'message' }),
  ],
  providers: [MessageConsumer],
  exports: [BullModule],
})
export class QueueModule {}


