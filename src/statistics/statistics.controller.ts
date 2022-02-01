import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('tournament')
  findByTournament(@Query() query: { id?: string }) {
    return this.statisticsService.findByTournament(+query.id);
  }
}
