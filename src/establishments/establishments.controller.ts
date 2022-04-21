import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/common/decorators';
import { JwtTokenDto } from 'src/common/dto';

@UseGuards(JwtAuthGuard)
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post('create')
  create(@Request() req: any, @Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentsService.create(req.user.userId, createEstablishmentDto);
  }

  @Get('find/all')
  findAll() {
    return this.establishmentsService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(+id);
  }

  @Get('find/user/:userId')
  findMany(@User() user: JwtTokenDto) {
    return this.establishmentsService.findByUser(user.userId);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateEstablishmentDto: UpdateEstablishmentDto) {
    return this.establishmentsService.update(+id, updateEstablishmentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.establishmentsService.remove(+id);
  }
}
