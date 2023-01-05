import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';

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

    const passwordMatched = bcrypt.compareSync(password, user.password);

    if (!passwordMatched) {
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

  async signup(createUserDto: CreateUserDTO) {
    const userExist = await this.usersService.findOne(createUserDto.email);
    if (userExist) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `This user already exist`,
        },
        HttpStatus.CONFLICT,
      );
    }

    let user: User;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(createUserDto.password, salt);

    try {
      user = await this.usersService.create({ ...createUserDto, password });
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '500 Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (user) {
      let response = {
        id: user.id,
        email: user.email,
      };

      return {
        user: {
          ...response,
          token: this.jwtService.sign(response),
        },
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '500 Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
