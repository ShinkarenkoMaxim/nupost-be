import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, ReviewModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
