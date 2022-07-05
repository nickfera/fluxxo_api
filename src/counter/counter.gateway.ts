import { Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { JwtWsGuard } from "src/common/guards";
import { UsersService } from "src/users/users.service";
import { EstablishmentsService } from "src/establishments/establishments.service";
import { flatten, unflatten} from "flat";
import { CacheManagerService } from "src/cacheManager/cacheManager.service";

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
    private establishmentsService: EstablishmentsService,
    private cacheManagerService: CacheManagerService,
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

        const establishmentCache = await this.cacheManagerService.get<any>(`establishment${establishmentId}`);

        if (!establishmentCache) {
          this.logger.log(`Creating local pointer for establishment information since it was inactive`);

          const establishmentData = {
            id: establishmentId,
            entrances: [],
          };

          entrances.forEach(entrance => {
            establishmentData.entrances.push({
              id: entrance.id,
              current: 0,
              in: 0,
              out: 0,
              users: [user.id],
              active: [],
            });
          });

          await this.cacheManagerService.set(`establishment${establishmentId}`, flatten(establishmentData));
        }

        else if (establishmentCache) {
          const establishmentData: any = unflatten(establishmentCache);

          establishmentData.users.push(user.id);

          this.cacheManagerService.set(`establishment${establishmentId}`, flatten(establishmentData));
        }
      })
      .catch(error => {
        this.logger.error(`Websocket connection failed: invalid jwt token`);
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

    if (!userId || !establishmentId || !entranceId) {
      this.logger.error('Invalid data to set entrance');
      throw new WsException('Invalid data to set entrance');
    }

    this.cacheManagerService.get(`establishment${establishmentId}`)
      .then(async (result: any) => {
        const establishmentCache: any = unflatten(result);

        const entranceIndex = establishmentCache.entrances.findIndex((entrance: any) => entrance.id === entranceId);
    
        if (entranceIndex === -1) {
          this.logger.error(`An unexpected error occurred: permission denied`);
          throw new WsException(`An unexpected error occurred: permission denied`);
        }
    
        establishmentCache.entrances.forEach((entrance: any, index: number) =>
          establishmentCache.entrances[index].active.filter((activeUserId: number) => activeUserId !== userId));
    
        establishmentCache.entrances[entranceIndex].active.push(userId);

        this.logger.log(flatten(establishmentCache));

        await this.cacheManagerService.set(`establishment${establishmentId}`, flatten(establishmentCache));

        this.logger.log('Entrance set successfully')
      })
      .catch((error: any) => {
        this.logger.error(`An error has occurred trying to set the entrance '${entranceId}' from the establishment '${establishmentId}' for the user '${userId}'`);
        throw new WsException(error);
      });
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('add')
  async add(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    this.logger.log(`Adding to establishment...`);

    const { sub: userId } = await this.jwtService.verifyAsync(client.handshake.auth.token.split(' ')[1]);
    const establishmentId = +client.handshake.query.establishmentId;

    this.cacheManagerService.get(`establishment${establishmentId}`)
      .then(async (result: any) => {
        const establishmentCache: any = unflatten(result);

        const entranceIndex = establishmentCache.entrances.findIndex((entrance: any) => entrance.active.includes(+userId));

        if (entranceIndex < 0) {
          this.logger.error(`An error has occurred: no entrance was selected or the entrance was not found`);
          throw new WsException('An error has occurred: no entrance was selected or the entrance was not found');
        }

        establishmentCache.entrances[entranceIndex].current++;
        establishmentCache.entrances[entranceIndex].in++;

        this.logger.log(flatten(establishmentCache));

        await this.cacheManagerService.set(`establishment${establishmentId}`, flatten(establishmentCache));

        this.logger.log(`Added to establishment '${establishmentId}' entrance '${establishmentCache.entrances[entranceIndex].id}' successfully`);
      })
      .catch((error: any) => {
        this.logger.error(`An error has occurred trying to add to the establishment '${establishmentId}'`);
        throw new WsException(error);
      });
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('subtract')
  async subtract(@MessageBody() data: any, @ConnectedSocket() client: any): Promise<void> {
    this.logger.log(`subtracting from establishment...`);

    const { sub: userId } = await this.jwtService.verifyAsync(client.handshake.auth.token.split(' ')[1]);
    const establishmentId = +client.handshake.query.establishmentId;

    this.cacheManagerService.get(`establishment${establishmentId}`)
      .then(async (result: any) => {
        const establishmentCache: any = unflatten(result);

        const entranceIndex = establishmentCache.entrances.findIndex((entrance: any) => entrance.active.includes(+userId));

        if (entranceIndex < 0) {
          this.logger.error(`An error has occurred: no entrance was selected or the entrance was not found`);
          throw new WsException('An error has occurred: no entrance was selected or the entrance was not found');
        }

        establishmentCache.entrances[entranceIndex].current--;
        establishmentCache.entrances[entranceIndex].in--;

        this.logger.log(flatten(establishmentCache));

        await this.cacheManagerService.set(`establishment${establishmentId}`, flatten(establishmentCache));

        this.logger.log(`Subtracted from establishment '${establishmentId}' entrance '${establishmentCache.entrances[entranceIndex].id}' successfully`);
      })
      .catch((error: any) => {
        this.logger.error(`An error has occurred trying to subtract from the establishment '${establishmentId}'`);
        throw new WsException(error);
      });
  }
}