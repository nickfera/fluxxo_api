import { Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { JwtWsGuard } from "src/common/guards";
import { UsersService } from "src/users/users.service";
import { EstablishmentsService } from "src/establishments/establishments.service";

@WebSocketGateway(undefined, {
  transports: ['websocket'],
  cors: {
    origin: 'http://localhost:3000'
  }
})
export class CounterGateway implements OnGatewayConnection {
  private readonly logger = new Logger(CounterGateway.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private establishmentsService: EstablishmentsService
  ) {}

  @WebSocketServer()
  server: any;

  establishments: any = [];

  @UseGuards(JwtWsGuard)
  handleConnection(@ConnectedSocket() client: any, ...args: any[]): void {
    this.logger.log(`Connecting through websocket...`);
    
    const token = client.handshake.auth.token.split(' ')[1] ?? undefined;
    const establishmentId = +client.handshake.query.establishmentId;

    this.logger.log(`Verifiying jwt token`);
    
    this.jwtService.verifyAsync(token)
      .then(async token => {
        this.logger.log(`Token verified successfully. Retrieivng user and establishment information`);

        const user = await this.usersService.findById(token.sub);

        if (!user) {
          this.logger.error(`Websocket connection failed: user not found. token.sub = ${token.sub}`);
          return client.disconnect(true);
        }
        
        const establishments = await this.establishmentsService.findByUser(user.id);
        const establishment = establishments.find(e => (e.id === establishmentId));
        
        if (!establishment) {
          this.logger.error(`Websocket connection failed: establishment not found. userId = ${user.id}, establishmentId: ${establishmentId}`);
          return client.disconnect(true);
        }

        this.logger.log(`Retrieving establishment entrances`);

        const entrances = await establishment.entrances;

        this.logger.log(`Joining room establishment-${establishmentId}`);
        
        client.join(`establishment-${establishmentId}`);

        if (!this.establishments.find((establishment: any) => establishment.id === establishmentId)) {
          this.logger.log(`Creating local pointer for establishment information since it was inactive`);

          const index = this.establishments.push({
            id: establishmentId,
            entrances: [],
          }) - 1;

          entrances.forEach(entrance => {
            this.establishments[index].entrances.push({
              id: entrance.id,
              current: 0,
              in: 0,
              out: 0,
              users: [],
              active: [],
            });
          });
        }
      })
      .catch(error => {
        this.logger.error(`Websocket connection failed: invalid jwt token`)
        client.disconnect(true);
      });

      this.logger.log(`Websocket connection successful`);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('setEntrance')
  async setEntrance(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    const { entranceId } = data;
    const { sub: userId } = await this.jwtService.verifyAsync(client.handshake.auth.token.split(' ')[1]);
    const establishmentId = +client.handshake.query.establishmentId;

    if (!userId || !establishmentId || !entranceId)
      console.log('Dados inválidos para definir uma entrada');
    
    const establishmentIndex = this.establishments.findIndex((establishment: any) => establishment.id === establishmentId);
    if (establishmentId < 0)
      console.log('Estabelecimento inválido');
    
    const entranceIndex = this.establishments[establishmentIndex].entrances.findIndex((entrance: any) => entrance.id === +entranceId);
    if (entranceIndex < 0)
      console.log('Entrada inválida');
    
    this.establishments[establishmentIndex].entrances.forEach((entrance: any, index: number) => {
      this.establishments[establishmentIndex].entrances[index].active = entrance.active.filter((uId: number) => uId !== +userId);
    });

    this.establishments[establishmentIndex].entrances[entranceIndex].active.push(+userId);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('add')
  async add(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    console.log('adding to counter...');

    const { sub: userId } = await this.jwtService.verifyAsync(client.handshake.auth.token.split(' ')[1]);
    const establishmentId = +client.handshake.query.establishmentId;

    const establishmentIndex = this.establishments.findIndex((establishment: any) => establishment.id === establishmentId);
    if (establishmentId < 0)
      console.log('Estabelecimento inválido');

    const entranceIndex = this.establishments[establishmentIndex].entrances.findIndex((entrance: any) => entrance.active.includes(+userId));
    if (entranceIndex < 0)
      console.log('Entrada inválida');
    
    this.establishments[establishmentIndex].entrances[entranceIndex].current++;
    this.establishments[establishmentIndex].entrances[entranceIndex].in++;

    console.log(this.establishments[establishmentIndex]);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('subtract')
  async subtract(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    console.log('subtracting to counter...');

    const { sub: userId } = await this.jwtService.verifyAsync(client.handshake.auth.token.split(' ')[1]);
    const establishmentId = +client.handshake.query.establishmentId;

    const establishmentIndex = this.establishments.findIndex((establishment: any) => establishment.id === establishmentId);
    if (establishmentId < 0)
      console.log('Estabelecimento inválido');
    
    const entranceIndex = this.establishments[establishmentIndex].entrances.findIndex((entrance: any) => entrance.active.includes(userId));
    if (entranceIndex < 0)
      console.log('Entrada inválida');
    
    this.establishments[establishmentIndex].entrances[entranceIndex].current--;
    this.establishments[establishmentIndex].entrances[entranceIndex].out++;

    console.log(this.establishments[establishmentIndex]);
  }
}