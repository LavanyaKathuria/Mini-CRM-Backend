import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Prepare contract' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Draft contract for Acme Corp' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2, description: 'Employee user ID' })
  @IsInt()
  assignedToId: number;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsInt()
  customerId: number;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
