import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
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

@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService, private readonly jwt: JwtService) {}

  @Post()
  send(@Req() req: any, @Body() dto: SendMessageDto) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.messages.send(userId, dto);
  }

  @Get()
  list(@Req() req: any) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.messages.list(userId);
  }

  @Post('send')
  sendBulk(@Req() req: any, @Body() body: { contactIds: string[]; content: string }) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.messages.sendBulk(userId, body.contactIds, body.content);
  }

  @Get('status/:messageId')
  status(@Param('messageId') messageId: string) {
    return this.messages.getStatus(messageId);
  }
}


