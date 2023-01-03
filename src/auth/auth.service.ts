import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `This user is not exist`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (user && user.password !== password) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: `Wrong email or password`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      user: {
        ...payload,
        profilePic: user.profilePic,
        token: this.jwtService.sign(payload),
      },
    };
  }

  async verifyPayload(payload: any): Promise<User> {
    let user: User;

    try {
      user = await this.usersService.findOne(payload.email);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `This user is not exist`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    delete user.password;

    return user;
  }
}
