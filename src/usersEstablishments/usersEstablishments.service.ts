import { Injectable } from '@nestjs/common';
import { CreateUserEstablishmentDto } from './dto/create-userEstablishment.dto';
import { UpdateUserEstablishmentDto } from './dto/update-userEstablishment.dto';

@Injectable()
export class UsersEstablishmentsService {
  create(createUserEstablishmentDto: CreateUserEstablishmentDto) {
    return 'This action adds a new usersEstablishment';
  }

  findAll() {
    return `This action returns all usersEstablishments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersEstablishment`;
  }

  update(id: number, updateUserEstablishmentDto: UpdateUserEstablishmentDto) {
    return `This action updates a #${id} usersEstablishment`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersEstablishment`;
  }
}
