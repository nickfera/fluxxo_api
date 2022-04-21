import { Module } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsController } from './establishments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersEstablishmentsModule } from 'src/usersEstablishments/usersEstablishments.module';
import { UserEstablishment } from 'src/usersEstablishments/entities/userEstablishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment, UserEstablishment]), UsersModule, UsersEstablishmentsModule],
  controllers: [EstablishmentsController],
  providers: [EstablishmentsService],
  exports: [EstablishmentsService]
})
export class EstablishmentsModule {}
