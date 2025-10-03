import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { JwtModule } from '@nestjs/jwt';
import { QueueModule } from './queue/queue.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { MessagesModule } from './messages/messages.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, redisConfig] }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    QueueModule,
    AuthModule,
    ContactsModule,
    MessagesModule,
    AnalyticsModule,
  ],
})
export class AppModule {}


