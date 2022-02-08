import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindTournamentMatches } from './types';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchesService.create(dto);
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('tournament')
  findMatchesByTournamentId(@Query() query: FindTournamentMatches) {
    return this.matchesService.findMatchesByTournamentId(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }
}
