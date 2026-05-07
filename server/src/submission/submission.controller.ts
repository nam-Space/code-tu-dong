import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('submissions')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.submissionService.create({
      ...body,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.submissionService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAllGlobal() {
    return this.submissionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  getLeaderboard() {
    return this.submissionService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }
}
