import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Prisma, Role, TaskStatus } from '../../generated/prisma';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ ADMIN only
  async create(dto: CreateTaskDto): Promise<
    Prisma.TaskGetPayload<{
      include: {
        assignedTo: {
          select: { id: true; name: true; email: true };
        };
        customer: {
          select: { id: true; name: true; email: true; phone: true };
        };
      };
    }>
  > {
    const userExists = await this.prisma.user.findUnique({
      where: { id: dto.assignedToId },
    });

    if (!userExists) {
      throw new NotFoundException('Assigned user does not exist');
    }

    if (userExists.role !== Role.EMPLOYEE) {
      throw new BadRequestException('Task must be assigned to an EMPLOYEE');
    }

    const customerExists = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });

    if (!customerExists) {
      throw new NotFoundException('Customer does not exist');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.PENDING,
        assignedToId: dto.assignedToId,
        customerId: dto.customerId,
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
  }

  // ✅ ADMIN → all tasks
  // ✅ EMPLOYEE → only their assigned tasks
  async findAll(user: { userId: number; role: Role }): Promise<
    Prisma.TaskGetPayload<{
      include: {
        assignedTo: {
          select: { id: true; name: true; email: true };
        };
        customer: {
          select: { id: true; name: true; email: true; phone: true };
        };
      };
    }>[]
  > {
    const where =
      user.role === Role.EMPLOYEE ? { assignedToId: user.userId } : {};

    return this.prisma.task.findMany({
      where,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<
    Prisma.TaskGetPayload<{
      include: {
        assignedTo: {
          select: { id: true; name: true; email: true };
        };
        customer: {
          select: { id: true; name: true; email: true; phone: true };
        };
      };
    }>
  > {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateStatus(
    taskId: number,
    status: TaskStatus,
    user: { userId: number; role: Role },
  ): Promise<
    Prisma.TaskGetPayload<{
      include: {
        assignedTo: {
          select: { id: true; name: true; email: true };
        };
        customer: {
          select: { id: true; name: true; email: true; phone: true };
        };
      };
    }>
  > {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (user.role === Role.EMPLOYEE && task.assignedToId !== user.userId) {
      throw new ForbiddenException(
        'You can only update your own assigned tasks',
      );
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
  }
}
