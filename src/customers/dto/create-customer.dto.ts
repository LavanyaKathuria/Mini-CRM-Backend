import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Customer full name or organization name',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Unique customer email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '9999999999',
    description: 'Unique customer phone number',
  })
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: 'Acme Pvt Ltd',
    required: false,
    description: 'Optional company name',
  })
  @IsOptional()
  company?: string;
}
