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

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @Post()
  create(@Body() dto: CreateMatchDto) {
    return this.matchesService.create(dto);
  }

  @Get('tournament')
  findMatchesByTournamentId(@Query() query: FindTournamentMatchesQuery) {
    return this.matchesService.findMatchesByTournamentId(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMatchDto) {
    return this.matchesService.updateMatch(+id, dto);
  }
}
