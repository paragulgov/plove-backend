import { IsNumber, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsString()
  homeTeam: string;

  @IsString()
  awayTeam: string;

  @IsNumber()
  tournamentId: number;

  @IsString()
  betsWillEndAt: string;
}
