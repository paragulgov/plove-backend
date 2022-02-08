import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { FindMatchBets } from './types';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  create(@Body() dto: CreateBetDto) {
    return this.betsService.create(dto);
  }

  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @Get('match')
  findByMatch(@Query() query: FindMatchBets) {
    return this.betsService.findByMatch(query);
  }

  @Get('user')
  findByUser(@Query() query: { id?: string }) {
    return this.betsService.findByUser(+query.id);
  }
}
