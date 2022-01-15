import { IsNotEmpty, IsString } from "class-validator";

export class CreateEstablishmentDto {
  @IsString()
  @IsNotEmpty()
  corporateName: string;

  @IsString()
  @IsNotEmpty()
  tradeName: string;

  @IsString()
  @IsNotEmpty()
  registry: string;
}
