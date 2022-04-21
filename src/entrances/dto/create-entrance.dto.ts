import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateEntranceDto {
  @IsInt()
  @IsNotEmpty()
  establishmentId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}