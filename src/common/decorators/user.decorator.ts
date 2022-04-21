import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtTokenDto } from 'src/common/dto';

export const User = createParamDecorator(
  (data: keyof JwtTokenDto, ctx: ExecutionContext): JwtTokenDto | keyof JwtTokenDto => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  }
)