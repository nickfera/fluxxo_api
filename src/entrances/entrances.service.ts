import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentsService } from 'src/establishments/establishments.service';
import { Repository } from 'typeorm';
import { CreateEntranceDto } from './dto/create-entrance.dto';
import { UpdateEntranceDto } from './dto/update-entrance.dto';
import { Entrance } from './entities/entrance.entity';

@Injectable()
export class EntrancesService {
  constructor(
    @InjectRepository(Entrance)
    private entranceRepository: Repository<Entrance>,

    private establishmentsService: EstablishmentsService,
  ) {}

  async create(createEntranceDto: CreateEntranceDto): Promise<Entrance> {
    const { establishmentId, title } = createEntranceDto;
    const establishment = await this.establishmentsService.findOne(establishmentId);

    if(!establishment)
      throw new NotFoundException(`Estabelecimento ${establishmentId} não encontrado`);

    const entrance = this.entranceRepository.create({ establishment, title, active: true });

    return this.entranceRepository.save(entrance);
  }

  async findByEstablishment(establishmentId: number) {
    return await this.entranceRepository.find({ where: { establishmentId }});
  }

  findAll() {
    return `This action returns all entrances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entrance`;
  }

  update(id: number, updateEntranceDto: UpdateEntranceDto) {
    return `This action updates a #${id} entrance`;
  }

  remove(id: number) {
    return `This action removes a #${id} entrance`;
  }
}
