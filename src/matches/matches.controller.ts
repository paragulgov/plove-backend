import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchEntity } from './entities/match.entity';

@ApiTags('Матчи')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiOperation({ summary: 'Создать матч' })
  @ApiResponse({ status: 201, type: MatchEntity })
  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchesService.create(dto);
  }

  @ApiOperation({ summary: 'Получить все матчи' })
  @ApiResponse({ status: 200, type: MatchEntity })
  @Get()
  findAll() {
    return this.matchesService.findAll();
  }
}
