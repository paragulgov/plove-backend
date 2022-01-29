import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableEntity } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(TableEntity)
    private tableRepository: Repository<TableEntity>,
  ) {}

  create(id: number) {
    return this.tableRepository.save({ tournament: { id: id } });
  }

  findAll() {
    return this.tableRepository.find({ relations: ['tournament'] });
  }
}
