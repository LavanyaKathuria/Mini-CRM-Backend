import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================
  // CREATE CUSTOMER (ADMIN)
  // ============================
  async create(dto: CreateCustomerDto) {
    const existing = await this.prisma.customer.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existing) {
      throw new ConflictException(
        'Customer with this email or phone already exists',
      );
    }

    const data: Prisma.CustomerCreateInput = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
    };

    return this.prisma.customer.create({
      data,
    });
  }

  // ============================
  // GET CUSTOMERS WITH PAGINATION + SEARCH
  // (ADMIN + EMPLOYEE)
  // ============================
  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput | undefined = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              email: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        }
      : undefined;

    const [totalRecords, customers] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      page,
      limit,
      totalRecords,
      totalPages,
      data: customers,
    };
  }

  // ============================
  // GET CUSTOMER BY ID
  // (ADMIN + EMPLOYEE)
  // ============================
  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  // ============================
  // DELETE CUSTOMER (ADMIN)
  // ============================
  async delete(id: number) {
    const existing = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Customer not found');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
