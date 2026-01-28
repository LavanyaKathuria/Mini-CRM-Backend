import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'contact@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '9999999999' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Acme', required: false })
  @IsOptional()
  company?: string;
}
