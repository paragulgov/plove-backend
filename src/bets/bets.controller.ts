import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BetsService } from './bets.service';
import { FindMatchBetsQuery } from './types';
import { GetUser } from '../custom/decorators/getUser.decorator';
import { JwtAuthGuard } from '../custom/guards/jwt-auth.guard';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Get('match')
  findByMatch(@Query() query: FindMatchBetsQuery) {
    return this.betsService.findByMatch(query);
  }

  @Get('user')
  findByUser(@Query() query: { id?: string }) {
    return this.betsService.findByUser(+query.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkAccess/:id')
  checkAccess(@GetUser() user, @Param('id') matchId: string) {
    return this.betsService.checkAccess(+user.id, +matchId);
  }
}
