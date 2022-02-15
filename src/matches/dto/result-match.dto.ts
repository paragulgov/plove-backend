import { IsNumber } from 'class-validator';

export class ResultMatchDto {
  @IsNumber()
  homeTeamGoals: number;

  @IsNumber()
  awayTeamGoals: number;
}
