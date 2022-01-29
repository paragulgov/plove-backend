import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Укажите название турнира' })
  @IsString()
  name: string;
}
