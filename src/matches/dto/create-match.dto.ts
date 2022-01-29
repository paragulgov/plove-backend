import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Укажите название домашней команды' })
  @IsString()
  homeTeam: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Укажите название выездной команды' })
  @IsString()
  awayTeam: string;
}
