import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { Repository, getRepository } from 'typeorm';
import { Establishment } from './entities/establishment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserEstablishment } from 'src/usersEstablishments/entities/userEstablishment.entity';
import { UsersEstablishmentsService } from 'src/usersEstablishments/usersEstablishments.service';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>,

    private usersService: UsersService,

    private usersEstablishmentsService: UsersEstablishmentsService,
  ) {}

  async create(userId: number, createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    const establishment = this.establishmentRepository.create(createEstablishmentDto);
    const user = await this.usersService.findById(userId);

    const newEstablishment = await this.establishmentRepository.save(establishment);

    if (!user)
      throw new NotFoundException(`Usuário não encontrado.`);
    
    await this.usersEstablishmentsService.create({ user, role: 1, establishment: newEstablishment });

    return newEstablishment;
  }

  findAll(): Promise<Establishment[]> {
    return this.establishmentRepository.find();
  }

  findOne(id: number): Promise<Establishment> {
    return this.establishmentRepository.findOne(id);
  }

  async findByUser(userId: number): Promise<Establishment[]> {
    return await this.establishmentRepository
      .createQueryBuilder('establishment')
      .innerJoin('establishment.users', 'user', 'user.id = :userId', { userId })
      .getMany();
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
