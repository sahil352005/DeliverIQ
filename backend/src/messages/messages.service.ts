import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('message') private readonly messageQueue: Queue,
  ) {}

  async send(userId: string, dto: SendMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        senderId: userId,
        contactId: dto.contactId,
        content: dto.content,
        status: 'PENDING',
      },
    });
    await this.messageQueue.add('send', { messageId: message.id }, {
      removeOnComplete: true,
      attempts: 5,
      backoff: { type: 'exponential', delay: 500 },
    });
    return message;
  }

  async sendBulk(userId: string, contactIds: string[], content: string) {
    const createManyData = contactIds.map((contactId) => ({ senderId: userId, contactId, content, status: 'PENDING' as any }));
    const created = await this.prisma.message.createMany({ data: createManyData, skipDuplicates: false });
    const messages = await this.prisma.message.findMany({ where: { senderId: userId }, orderBy: { createdAt: 'desc' }, take: createManyData.length });
    await Promise.all(messages.map((m: any) => this.messageQueue.add('send', { messageId: m.id }, {
      removeOnComplete: true,
      attempts: 5,
      backoff: { type: 'exponential', delay: 500 },
    })));
    return messages;
  }

  list(userId: string) {
    return this.prisma.message.findMany({ where: { senderId: userId }, orderBy: { createdAt: 'desc' } });
  }

  getStatus(messageId: string) {
    return this.prisma.message.findUnique({ where: { id: messageId }, select: { id: true, status: true, error: true, sentAt: true } });
  }
}


