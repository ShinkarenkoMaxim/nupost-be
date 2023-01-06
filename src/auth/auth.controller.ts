import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { FacebookAuthGuard, LocalAuthGuard } from './guards';
import { GoogleAuthGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: any): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userData: CreateUserDTO): Promise<any> {
    return this.authService.signup(userData);
  }

  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  @HttpCode(HttpStatus.OK)
  async facebookLogin(): Promise<any> {}

  @Get('/callback/facebook')
  @UseGuards(FacebookAuthGuard)
  @HttpCode(HttpStatus.OK)
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    return { user: req.user };
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Req() req: any): Promise<any> {
    console.log(req);
  }

  @Get('/callback/google/')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  async googleLoginRedirect(@Req() req: any): Promise<any> {
    return { user: req.user };
  }

  // TODO: add sessions for authentication with socails
  // Need to think about store token on frontend
}
