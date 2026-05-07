import { Controller, Get, Post, Body, Param, Query, UseGuards, Patch, Delete } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('problems')
export class ProblemController {
  constructor(private problemService: ProblemService) {}

  @Get()
  findAll(@Query('contestId') contestId?: string) {
    if (contestId) {
      return this.problemService.findByContest(contestId);
    }
    return this.problemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: any) {
    return this.problemService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.problemService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemService.remove(id);
  }
}
