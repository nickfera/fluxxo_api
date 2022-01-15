import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { Repository } from 'typeorm';
import { Establishment } from './entities/establishment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>
  ) {}

  create(createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    const establishment = this.establishmentRepository.create(createEstablishmentDto);
    return this.establishmentRepository.save(establishment);
  }

  findAll(): Promise<Establishment[]> {
    return this.establishmentRepository.find();
  }

  findOne(id: number): Promise<Establishment> {
    return this.establishmentRepository.findOne(id);
  }

  async update(id: number, updateEstablishmentDto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.establishmentRepository.preload({
      id,
      ...updateEstablishmentDto,
    });

    if(!establishment)
      throw new NotFoundException(`Estabelecimento ${id} não encontrado`);
    
    return this.establishmentRepository.save(establishment);
  }

  async remove(id: number) {
    const establishment = await this.establishmentRepository.findOne(id);
    return this.establishmentRepository.remove(establishment);
  }
}
