import { CanActivate, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}

  canActivate(context: any): boolean | Promise<boolean | any> | Observable<boolean | any> {
    return new Promise((resolve, reject) => {
      const token = context.args[0].handshake.auth?.token.split(' ')[1] ?? '';
      const verified = this.jwtService.verify(token);

      if (!token || !verified) reject(false);
      
      else resolve(verified);
    });
  }
}