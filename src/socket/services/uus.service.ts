// User Use Service
import { Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "src/app/constants/constants";
import DBOrm from "src/db/dbOrm/dbOrm";
import { UserDB } from "src/db/entitites/user.entity";
import { Server } from 'socket.io'
import { OnlineUserEntity } from "src/db/entitites/onlineUser.entity";
@Injectable()
export class UserUseService {
    public server: Server = null;

    constructor(@Inject(PG_CONNECTION) private dbOrm: DBOrm) {}

    async connectUser(user_id: string, socket_id: string) {
        const onlineUser: OnlineUserEntity = await this.dbOrm.in('onlineUsers').addRow([user_id, socket_id]);        
        const userDB: UserDB = await this.dbOrm.in('users').getRow({user_id: user_id});
        userDB.rooms.forEach((room_id) => {
            this.server.to(room_id).emit('', {})
        })
    }
}