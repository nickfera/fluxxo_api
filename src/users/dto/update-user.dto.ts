import { IsNotEmpty, IsOptional, IsEmail, IsString, Equals } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail({ message: 'O e-mail informado não é um e-mail válido.' })
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  confirmNewPassword: string;
}