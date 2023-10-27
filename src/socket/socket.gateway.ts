import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { UserUseService } from "./services/uus.service";
import { ServerUseService } from "./services/sus.service";
import { MessageReq } from "src/db/entitites/types/common/message.type";
 
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
    handleConnection(socket: Socket) {}

    async handleDisconnect(socket: any) {
        try {
            const rooms = await this.userUseService.disconnectUser(socket.id) 
            rooms.forEach((room) => socket.leave(room.room_id))
        } catch(err) {
            console.log(err)
        }
    }

    @SubscribeMessage('connectToServer')
    async connectToServer(socket: Socket, body: {
        user_id: string;
    }) {
        try { 
            const onlineUser =  await this.userUseService.connectUser(body.user_id, socket.id);
            const rooms =  await this.userUseService.connectToRooms(body.user_id);

            rooms.forEach((room) => {
                socket.join(room.room_id)
            })

            this.server.to(socket.id).emit('connectToServer', {
                status: onlineUser ? true : false
            }) 
        }
        catch(err) {
            console.log(err)
        }
    }

    @SubscribeMessage('sendMessageInRoom')
    async sendMessageInRoom(socket: Socket, msg: MessageReq) {
        try { 
            const {room, messagesInDB} = await this.userUseService.sendMessageInRoom(msg);
            console.log(messagesInDB)
            if (room) {
                this.server.to(room.room_id).emit('sendMessageInRoom', messagesInDB)
            }
        } catch(err) {
            console.log(err)
        }
    }
}