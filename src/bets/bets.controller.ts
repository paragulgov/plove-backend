import { Body, Controller, Get, Post } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';

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
}
