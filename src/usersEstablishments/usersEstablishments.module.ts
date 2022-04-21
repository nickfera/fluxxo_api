import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEstablishmentsService } from './usersEstablishments.service';
import { UsersEstablishmentsController } from './usersEstablishments.controller';
import { UserEstablishment } from './entities/userEstablishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEstablishment])],
  controllers: [UsersEstablishmentsController],
  providers: [UsersEstablishmentsService],
  exports: [UsersEstablishmentsService]
})
export class UsersEstablishmentsModule {}
