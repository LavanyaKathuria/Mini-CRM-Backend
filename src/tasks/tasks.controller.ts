import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

interface AuthRequest extends Request {
  user: {
    userId: number;
    role: 'ADMIN' | 'EMPLOYEE';
  };
}

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 🔒 ADMIN only
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a task (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  // ✅ ADMIN → all tasks | EMPLOYEE → own tasks
  @Get()
  @ApiOperation({
    summary: 'Get tasks (ADMIN sees all, EMPLOYEE sees assigned tasks)',
  })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  findAll(@Req() req: AuthRequest) {
    return this.tasksService.findAll(req.user);
  }

  // ✅ Any authenticated user
  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  // ✅ Update task status
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update task status (EMPLOYEE only for own task)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req: AuthRequest,
  ) {
    return this.tasksService.updateStatus(id, dto.status, req.user);
  }
}
