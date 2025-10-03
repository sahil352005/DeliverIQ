import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  contactId!: string;

  @IsString()
  content!: string;
}


