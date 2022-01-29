import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentEntity } from './entities/tournament.entity';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(TournamentEntity)
    private tournamentRepository: Repository<TournamentEntity>,
    private readonly tablesService: TablesService,
  ) {}

  async create(dto: CreateTournamentDto) {
    const tournament = await this.tournamentRepository.save(dto);

    if (tournament && tournament.id) {
      const table = await this.tablesService.create(tournament.id);

      if (table) {
        return this.tournamentRepository.findOne(tournament.id, {
          relations: ['table'],
        });
      }
    }

    throw new BadRequestException('Неудалось создать турнир');
  }

  findAll() {
    return this.tournamentRepository.find();
  }

  findOne(id: number) {
    return this.tournamentRepository.findOne(id, { relations: ['matches'] });
  }

  async update(id: number, dto: UpdateTournamentDto) {
    await this.tournamentRepository.update(id, dto);
    const updatedTournament = await this.tournamentRepository.findOne(id);

    if (updatedTournament) {
      return updatedTournament;
    }

    throw new NotFoundException('Турнир не найден');
  }

  async remove(id: number) {
    const find = await this.tournamentRepository.findOne(id);
    const deleteResponse = await this.tournamentRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new NotFoundException('Турнир не найден');
    }

    return find;
  }
}
