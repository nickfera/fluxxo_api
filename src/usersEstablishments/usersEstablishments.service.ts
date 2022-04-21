import { Injectable, UseGuards, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/common/guards';
import { CreateUserEstablishmentDto } from './dto/create-userEstablishment.dto';
import { UpdateUserEstablishmentDto } from './dto/update-userEstablishment.dto';
import { UserEstablishment } from './entities/userEstablishment.entity';

@UseGuards(JwtAuthGuard)
@Injectable()
export class UsersEstablishmentsService {
  constructor(
    @InjectRepository(UserEstablishment)
    private usersEstablishmentsRepository: Repository<UserEstablishment>
  ) {}

  async create(createUserEstablishmentDto: CreateUserEstablishmentDto): Promise<UserEstablishment> {
    const userEstablishment = this.usersEstablishmentsRepository.create(createUserEstablishmentDto);
    return this.usersEstablishmentsRepository.save(userEstablishment);
  }

  findAll(): Promise<UserEstablishment[]> {
    return this.usersEstablishmentsRepository.find();
  }

  findOne(id: number): Promise<UserEstablishment> {
    return this.usersEstablishmentsRepository.findOne(id);
  }

  async update(id: number, updateUserEstablishmentDto: UpdateUserEstablishmentDto): Promise<UserEstablishment> {
    const userEstablishment = await this.usersEstablishmentsRepository.preload({
      id,
      ...updateUserEstablishmentDto
    });

    if (!userEstablishment)
      throw new NotFoundException(`Usuário Estabelecimento ${id} não encontrado`);
    
    return this.usersEstablishmentsRepository.save(userEstablishment);
  }

  async remove(id: number) {
    const userEstablishment = await this.usersEstablishmentsRepository.findOne(id);
    return this.usersEstablishmentsRepository.remove(userEstablishment);
  }
}
