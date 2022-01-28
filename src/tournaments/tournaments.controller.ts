import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TournamentEntity } from './entities/tournament.entity';

@ApiTags('Турниры')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @ApiOperation({ summary: 'Создать турнир' })
  @ApiResponse({ status: 201, type: TournamentEntity })
  @Post()
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentsService.create(dto);
  }

  @ApiOperation({ summary: 'Получить все турниры' })
  @ApiResponse({ status: 200, type: [TournamentEntity] })
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @ApiOperation({ summary: 'Получить один турнир' })
  @ApiResponse({ status: 200, type: TournamentEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Изменить турнир' })
  @ApiResponse({ status: 200, type: TournamentEntity })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTournamentDto) {
    return this.tournamentsService.update(+id, dto);
  }

  @ApiOperation({ summary: 'Удалить турнир' })
  @ApiResponse({ status: 200, type: TournamentEntity })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
