import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EstablishmentsService } from 'src/establishments/establishments.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private establishmentsService: EstablishmentsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...userData } = user;
      return userData;
    }
    else
      return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user,
      roles: [],
    };
  }

  async authenticated(userId: number): Promise<any> {
    const user = await this.usersService.findById(userId);
    const establishments = await this.establishmentsService.findByUser(userId);

    if (!user)
      return { authenticated: false };
    
    const { password, createdAt, updatedAt, ...userData } = user;

    return {
      authenticated: true,
      user: { ...userData },
      establishments,
    };
  }
}