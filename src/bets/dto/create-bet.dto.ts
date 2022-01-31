import { IsNumber } from 'class-validator';

export class CreateBetDto {
  @IsNumber()
  homeTeamGoalsBet: number;

  @IsNumber()
  awayTeamGoalsBet: number;

  @IsNumber()
  matchId: number;
}
