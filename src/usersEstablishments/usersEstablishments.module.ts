import { Module } from '@nestjs/common';
import { UsersEstablishmentsService } from './usersEstablishments.service';
import { UsersEstablishmentsController } from './usersEstablishments.controller';

@Module({
  controllers: [UsersEstablishmentsController],
  providers: [UsersEstablishmentsService]
})
export class UsersEstablishmentsModule {}
