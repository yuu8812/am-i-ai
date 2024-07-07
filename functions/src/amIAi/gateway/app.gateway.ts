import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/amIAi/auth/auth.service';

@Injectable()
@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}

  afterInit(server: Server) {
    Logger.log('Websocket server initialized', 'WebSocket Server');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization?.split(' ')[1];

    client.emit('connection', 'Successfully connected to the server.');

    if (!token) throw new WsException('Empty credentials.');

    const userId = await this.authService.validateSocket(token);

    if (!userId) throw new WsException('Invalid credentials.');

    Logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
  }
}
