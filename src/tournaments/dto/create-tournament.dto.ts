import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTournamentDto {
  @IsNotEmpty({ message: 'Укажите название турнира' })
  @IsString()
  name: string;
}
