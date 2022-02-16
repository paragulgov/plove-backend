import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindTournamentMatchesQuery } from './types';
import { JwtAuthGuard } from '../custom/guards/jwt-auth.guard';
import { RolesGuard } from '../custom/guards/roles.guard';
import { Roles } from '../custom/decorators/roles.decorator';
import { Role } from '../types/authTypes';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ResultMatchDto } from './dto/result-match.dto';
import { GetUser } from '../custom/decorators/getUser.decorator';
import { CreateBetDto } from '../bets/dto/create-bet.dto';
import { UpdateBetDto } from '../bets/dto/update-bet.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @Post()
  createMatch(@Body() dto: CreateMatchDto) {
    return this.matchesService.createMatch(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bets')
  createBet(@GetUser() user, @Body() dto: CreateBetDto) {
    return this.matchesService.createBet(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bets')
  updateBet(@GetUser() user, @Body() dto: UpdateBetDto) {
    return this.matchesService.updateBet(user.id, dto);
  }

  @Get('tournament')
  findMatchesByTournamentId(@Query() query: FindTournamentMatchesQuery) {
    return this.matchesService.findMatchesByTournamentId(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @Patch('result/:id')
  resultMatch(
    @Param('id') matchId: string,
    @Body() dto: ResultMatchDto,
    @GetUser() user,
  ) {
    return this.matchesService.resultMatch(+matchId, +user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @Patch(':id')
  updateMatch(@Param('id') id: string, @Body() dto: UpdateMatchDto) {
    return this.matchesService.updateMatch(+id, dto);
  }
}
