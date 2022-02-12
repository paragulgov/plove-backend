import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { FindMatchBetsQuery } from './types';
import { GetUser } from '../custom/decorators/getUser.decorator';
import { JwtAuthGuard } from '../custom/guards/jwt-auth.guard';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser() user, @Body() dto: CreateBetDto) {
    return this.betsService.create(user.id, dto);
  }

  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @Get('match')
  findByMatch(@Query() query: FindMatchBetsQuery) {
    return this.betsService.findByMatch(query);
  }

  @Get('user')
  findByUser(@Query() query: { id?: string }) {
    return this.betsService.findByUser(+query.id);
  }
}
