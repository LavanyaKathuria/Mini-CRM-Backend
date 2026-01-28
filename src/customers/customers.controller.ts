import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ✅ ADMIN only
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new customer (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  // ✅ ADMIN + EMPLOYEE
  @Get()
  @ApiOperation({ summary: 'Get customers with pagination and search' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, email, or phone',
    example: 'acme',
  })
  @ApiResponse({ status: 200, description: 'Paginated customer list' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.customersService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search,
    );
  }

  // ✅ ADMIN + EMPLOYEE
  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }
}
