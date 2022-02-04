import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../custom/guards/jwt-auth.guard';
import { Roles } from '../custom/decorators/roles.decorator';
import { RolesGuard } from '../custom/guards/roles.guard';
import { Role } from '../types/authTypes';
import { UserEntity } from '../users/entities/user.entity';
import { AuthVKDto } from './dto/auth-vk-dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/login/vk')
  async vkLogin(@Body() dto: AuthVKDto): Promise<UserEntity> {
    let vkTokenResponse;

    try {
      vkTokenResponse = await this.authService.getVkToken(dto);
    } catch (err) {
      throw new UnauthorizedException('VK code error');
    }

    const user = await this.usersService.findByVkId(
      vkTokenResponse.data.user_id,
    );

    if (user) {
      return this.authService.authenticate(user.vkId);
    }

    try {
      const vkUserDataResponse = await this.authService.getUserDataFromVk(
        vkTokenResponse.data.user_id,
        vkTokenResponse.data.access_token,
      );

      const vkUserData = vkUserDataResponse.data.response[0];

      const newUser = {
        vkId: vkUserData.id,
        fullName: `${vkUserData.first_name} ${vkUserData.last_name}`,
      };

      await this.usersService.create(newUser);

      return this.authService.authenticate(newUser.vkId);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.MODERATOR, Role.ADMIN)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
