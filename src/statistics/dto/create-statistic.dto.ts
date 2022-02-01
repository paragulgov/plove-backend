import { IsNumber } from 'class-validator';

export class CreateStatisticDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  tournamentId: number;
}
