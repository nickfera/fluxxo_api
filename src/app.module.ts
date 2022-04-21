import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EstablishmentsModule } from './establishments/establishments.module';
import { UsersEstablishmentsModule } from './usersEstablishments/usersEstablishments.module';
import { EntrancesModule } from './entrances/entrances.module';
import { AuthModule } from './auth/auth.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    TypeOrmModule.forRoot(),
    UsersModule,
    EstablishmentsModule,
    UsersEstablishmentsModule,
    EntrancesModule,
    AuthModule,
    CounterModule
  ],
})
export class AppModule {
  constructor() {}
}