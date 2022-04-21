import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrancesService } from './entrances.service';
import { EntrancesController } from './entrances.controller';
import { Entrance } from './entities/entrance.entity';
import { EstablishmentsModule } from 'src/establishments/establishments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Entrance]), EstablishmentsModule],
  controllers: [EntrancesController],
  providers: [EntrancesService]
})
export class EntrancesModule {}
