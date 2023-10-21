import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UserUseService } from "./services/uus.service";
import { ServerUseService } from "./services/sus.service";
 
@WebSocketGateway(Number(process.env.SOCKET_PORT), {
    transports: ['websocket'],
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['POST', 'GET']
    }
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() public server: Server;

    constructor(
        private userUseService: UserUseService, 
        private serverUseService: ServerUseService
    ) {}

    afterInit(server: Server) {
        this.userUseService.server = server;
        this.serverUseService.server = server;
    }
    handleConnection(socket: Socket) {

        // Добавляем пользователя в таблицу user_online
        
        // рассылаем в комнаты сообщение, что пользователь в сети

        // Указать что пользователь в сети
        // console.log(socket.id);
        // console.log(Array.from(socket.rooms));
    }
    handleDisconnect(socket: any) {}
}