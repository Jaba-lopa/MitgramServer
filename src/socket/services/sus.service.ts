// Server Use Service
import { Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "src/app/constants/constants";
import DBOrm from "src/db/dbOrm/dbOrm";
import { UserDB } from "src/db/entitites/user.entity";
import { Server } from 'socket.io'
@Injectable()
export class ServerUseService {
    public server: Server = null;

    constructor(@Inject(PG_CONNECTION) private dbOrm: DBOrm) {}
    async getUserRooms(user_id: string) {
        const userDB: UserDB = await this.dbOrm.in('users').getRow({user_id: user_id});
        return userDB.rooms;
    }
}