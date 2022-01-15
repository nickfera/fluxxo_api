import { IsInt, IsNotEmpty, Min, Max } from "class-validator";
import { Establishment } from "src/establishments/entities/establishment.entity";
import { User } from "src/users/entities/user.entity";

export class CreateUserEstablishmentDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  establishment: Establishment;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(2)
  role: number;
}