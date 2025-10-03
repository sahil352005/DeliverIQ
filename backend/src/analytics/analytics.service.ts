import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(userId: string) {
    const [total, sent, failed, pending] = await Promise.all([
      this.prisma.message.count({ where: { senderId: userId } }),
      this.prisma.message.count({ where: { senderId: userId, status: 'SENT' } }),
      this.prisma.message.count({ where: { senderId: userId, status: 'FAILED' } }),
      this.prisma.message.count({ where: { senderId: userId, status: 'PENDING' } }),
    ]);
    // time-based: messages per hour for last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const perHour = await this.prisma.$queryRawUnsafe(
      `
      SELECT date_trunc('hour', "createdAt") as hour, count(*)::int as count
      FROM "Message"
      WHERE "senderId" = $1 AND "createdAt" >= $2
      GROUP BY 1
      ORDER BY 1
      `,
      userId,
      since,
    ) as any[];
    return { total, sent, failed, pending, perHour };
  }
}


