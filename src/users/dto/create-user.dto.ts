import { IsEmail, Length, IsNotEmpty } from 'class-validator';
import { UniqueOnDatabase } from 'src/custom/validators/UniqueValidation';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Введите имя' })
  fullName: string;

  @IsEmail({}, { message: 'Введите корректно почту' })
  @UniqueOnDatabase(UserEntity, { message: 'Почта уже используется' })
  email: string;

  @Length(6, 32, { message: 'Длина пароля от 6 до 32 символов' })
  password?: string;
}
