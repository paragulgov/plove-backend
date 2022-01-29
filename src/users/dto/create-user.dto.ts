import { IsEmail, Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueOnDatabase } from 'src/custom/validators/UniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Введите имя' })
  fullName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Введите корректно почту' })
  @UniqueOnDatabase(UserEntity, { message: 'Почта уже используется' })
  email: string;

  @ApiProperty()
  @Length(6, 32, { message: 'Длина пароля от 6 до 32 символов' })
  password?: string;
}
