// User Use Service
import { BadGatewayException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "src/app/constants/constants";
import DBOrm from "src/db/dbOrm/dbOrm";
import { UserDB } from "src/db/entitites/user.entity";
import { Server } from 'socket.io'
import { OnlineUserEntity } from "src/db/entitites/onlineUser.entity";
import { RoomDB } from "src/db/entitites/room.entity";
import convertObjArrToJSON from "src/app/utils/convertObjArrToJson";
import { MessageDB, MessageReq } from "src/db/entitites/types/common/message.type";
@Injectable()
export class UserUseService {
    public server: Server = null;

    constructor(@Inject(PG_CONNECTION) private dbOrm: DBOrm) {}

    async connectUser(user_id: string, socket_id: string) {
        const onlineUser: OnlineUserEntity = await this.dbOrm.in('onlineUsers').addRow([user_id, socket_id]);        
        return onlineUser;
    }

    async disconnectUser(socket_id: string) {
        const onlineUser: OnlineUserEntity = await this.dbOrm.in('onlineusers').removeRow({ socket_id: socket_id });
        console.log(onlineUser)
        const user: UserDB = await this.dbOrm.in('users').getRow({ user_id: onlineUser.user_id })
        return user.rooms 
    }

    async connectToRooms (user_id: string) {
        const onlineUser: OnlineUserEntity = await this.dbOrm.in('onlineusers').getRow({ user_id: user_id });
        if (!onlineUser) throw new BadGatewayException('Пользователь не подключён')
        const userDB: UserDB = await this.dbOrm.in('users').getRow({ user_id: user_id });
        return userDB.rooms;
    }   

    async sendMessageInRoom(message: MessageReq) {
        const roomDB: RoomDB = await this.dbOrm.in('rooms').getRow({ room_id: message.room_id });
        const candidate = roomDB.room_members.find((member) => member.user_id === message.user_id);
        if (!candidate) throw new ForbiddenException('Вы не являетесь участником этой группы')
        const roomMessagesJSON = convertObjArrToJSON(roomDB.room_messages);
        console.log('msg', message)
        let messagesInDB = new MessageDB({...message, date: new Date().toLocaleDateString()})
        const room: RoomDB = await this.dbOrm.in('rooms').updateRow({ room_messages: [...roomMessagesJSON, JSON.stringify(messagesInDB)] }, { room_id: message.room_id })
        return {room, messagesInDB};
    }
}