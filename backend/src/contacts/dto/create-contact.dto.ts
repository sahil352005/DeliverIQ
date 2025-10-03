import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string; // Use simple string to avoid locale issues
}


