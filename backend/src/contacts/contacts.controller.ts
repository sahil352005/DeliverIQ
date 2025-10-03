import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UploadContactsDto } from './dto/upload-contacts.dto';
import { JwtService } from '@nestjs/jwt';

// Lightweight guard substitute to decode JWT from Authorization header
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

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contacts: ContactsService, private readonly jwt: JwtService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateContactDto) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.contacts.create(userId, dto);
  }

  @Get()
  list(@Req() req: any) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.contacts.list(userId);
  }

  @Post('upload')
  upload(@Req() req: any, @Body() dto: UploadContactsDto) {
    const userId = extractUserIdFromAuthHeader(this.jwt, req);
    return this.contacts.upload(userId, dto);
  }
}


