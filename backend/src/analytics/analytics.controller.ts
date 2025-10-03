import { Controller, Get, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtService } from '@nestjs/jwt';

function extractUserIdFromAuthHeader(jwt: JwtService, req: any): string {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return '';
  try {
    const payload = jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev_secret' }) as any;
    return payload.sub as string;
  } catch {
    return '';
  }
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService, private readonly jwt: JwtService) {}

  @Get()
  overview(@Req() req: any) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.analytics.overview(userId);
  }
}


