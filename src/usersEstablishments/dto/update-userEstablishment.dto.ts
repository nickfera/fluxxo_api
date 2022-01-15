import { PartialType } from '@nestjs/mapped-types';
import { CreateUserEstablishmentDto } from './create-userEstablishment.dto';

export class UpdateUserEstablishmentDto extends PartialType(CreateUserEstablishmentDto) {}
