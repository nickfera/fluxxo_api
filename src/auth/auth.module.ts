import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/common/strategies';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/common/constants';
import { JwtStrategy } from 'src/common/strategies';
import { EstablishmentsModule } from 'src/establishments/establishments.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '12h' }
    }),
    EstablishmentsModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}