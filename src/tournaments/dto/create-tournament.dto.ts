import { IsNotEmpty, IsDefined } from 'class-validator';

export class CreateTournamentDto {
  @IsDefined({ message: 'Укажите название турнира' })
  @IsNotEmpty({ message: 'Укажите название турнира' })
  name: string;
}
