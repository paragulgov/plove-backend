import { IsString } from 'class-validator';

export class UpdateMatchDto {
  @IsString()
  betsWillEndAt: string;
}
