import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post()
  create(@Body() dto: CreateStatisticDto) {
    return this.statisticsService.create(dto);
  }

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @Get('tournament')
  findByTournament(@Query() query: { id?: string }) {
    return this.statisticsService.findByTournament(+query.id);
  }

  @Get('user/:id')
  findByUser(
    @Param('id') id: string,
    @Query() query: { tournamentId: string },
  ) {
    return this.statisticsService.findByUser(+id, +query.tournamentId);
  }
}
