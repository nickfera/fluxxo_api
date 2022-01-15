import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersEstablishmentsService } from './usersEstablishments.service';
import { CreateUserEstablishmentDto } from './dto/create-userEstablishment.dto';
import { UpdateUserEstablishmentDto } from './dto/update-userEstablishment.dto';

@Controller('usersEstablishments')
export class UsersEstablishmentsController {
  constructor(private readonly usersEstablishmentsService: UsersEstablishmentsService) {}

  @Post()
  create(@Body() createUserEstablishmentDto: CreateUserEstablishmentDto) {
    return this.usersEstablishmentsService.create(createUserEstablishmentDto);
  }

  @Get()
  findAll() {
    return this.usersEstablishmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersEstablishmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserEstablishmentDto: UpdateUserEstablishmentDto) {
    return this.usersEstablishmentsService.update(+id, updateUserEstablishmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersEstablishmentsService.remove(+id);
  }
}
