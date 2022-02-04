import { IsNotEmpty, IsString } from 'class-validator';

export class AuthVKDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
