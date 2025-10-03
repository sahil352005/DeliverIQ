import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UploadContactsDto } from './dto/upload-contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreateContactDto) {
    return this.prisma.contact.create({ data: { ownerId, name: dto.name, phone: dto.phone } });
  }

  list(ownerId: string) {
    return this.prisma.contact.findMany({ where: { ownerId }, orderBy: { createdAt: 'desc' } });
  }

  async upload(ownerId: string, dto: UploadContactsDto) {
    const data = dto.contacts.map((c) => ({ ownerId, name: c.name, phone: c.phone }));
    await this.prisma.contact.createMany({ data, skipDuplicates: true });
    return this.list(ownerId);
  }
}


