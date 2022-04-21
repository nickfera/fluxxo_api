import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    return await this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user)
      throw new NotFoundException(`Usuário não encontrado.`);

    if (updateUserDto.password && updateUserDto.newPassword && updateUserDto.confirmNewPassword) {
      if (updateUserDto.newPassword !== updateUserDto.confirmNewPassword)
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Para atualizar a senha, a nova senha e a confirmação da mesma devem ser iguais.'
        }, HttpStatus.BAD_REQUEST);
      
      if (!(await bcrypt.compare(updateUserDto.password, user.password)))
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'A senha atual está incorreta.'
        }, HttpStatus.BAD_REQUEST);
      
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);

      return this.usersRepository.save({
        id,
        email: updateUserDto?.email,
        name: updateUserDto?.name,
        password: hashedPassword,
      })
    }

    else if (!updateUserDto.password && !updateUserDto.newPassword && !updateUserDto.confirmNewPassword) {
      return this.usersRepository.save({
        id,
        email: updateUserDto?.email,
        name: updateUserDto?.name,
      });
    }

    else
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Para alterar a sua senha, a senha atual, a nova senha e a confirmação da mesma devem ser informados.'
      }, HttpStatus.BAD_REQUEST);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    return this.usersRepository.remove(user);
  }
}