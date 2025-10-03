import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContactDto } from './create-contact.dto';

export class UploadContactsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  contacts!: CreateContactDto[];
}


