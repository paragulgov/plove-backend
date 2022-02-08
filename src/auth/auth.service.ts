import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { AuthVKDto } from './dto/auth-vk-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private http: HttpService,
  ) {}

  async getVkToken(dto: AuthVKDto): Promise<any> {
    const client_id = process.env.VK_CLIENT_ID;
    const client_secret = process.env.VK_CLIENT_SECRET;
    const host = `${process.env.APP_HOST}/login/vk`;
    const url = `https://oauth.vk.com/access_token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${host}&code=${dto.code}`;

    return this.http.get(url).toPromise();
  }

  async getUserDataFromVk(userId: string, token: string): Promise<any> {
    const url = `https://api.vk.com/method/users.get?user_ids=${userId}&access_token=${token}&v=5.120`;

    return this.http.get(url).toPromise();
  }

  async authenticate(vkId: number): Promise<any> {
    const user = await this.usersService.findByVkId(vkId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = this.jwtService.sign({
      id: user.id,
      vkId: user.vkId,
      role: user.role,
    });

    return {
      id: user.id,
      vkId: user.vkId,
      fullName: user.fullName,
      role: user.role,
      token: token,
    };
  }
}
