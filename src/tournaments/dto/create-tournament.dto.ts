import { IsNotEmpty, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty()
  @IsDefined({ message: 'Укажите название турнира' })
  @IsNotEmpty({ message: 'Укажите название турнира' })
  name: string;
}
