import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounterGateway } from './counter.gateway';
import { CounterLog } from './entities/counterLog.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/common/constants';
import { UsersModule } from 'src/users/users.module';
import { EstablishmentsModule } from 'src/establishments/establishments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CounterLog]),
    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '12h' }
    }),
    UsersModule,
    EstablishmentsModule,
  ],
  exports: [CounterGateway],
  controllers: [],
  providers: [CounterGateway]
})
export class CounterModule {}
