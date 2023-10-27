import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { PG_CONNECTION } from "src/app/constants/constants";
import DBOrm from "src/db/dbOrm/dbOrm";
import { CreateRoomDto } from "../controller/dtos/request/createDto/create.dto";
import { SessionBodyDto } from "src/auth/controller/dtos/sessionBody.dto";
import { v4 } from 'uuid'
import { RemoveRoomDto } from "../controller/dtos/request/removeDto/remove.dto";
import { RoomDB } from "src/db/entitites/room.entity";
import { RoomMember } from "src/db/entitites/types/room.types";
import { UserDB } from "src/db/entitites/user.entity";
import convertObjArrToJSON from "src/app/utils/convertObjArrToJson";
import { UserDto } from "src/auth/controller/dtos/response/User.dto";

@Injectable()
export class RoomService {
    constructor (@Inject(PG_CONNECTION) private dbOrm: DBOrm) {}

    // async getRooms(user_id: string) {
    //     const userDB: UserDB = await this.dbOrm.in('rooms').getRow({ user_id: user_id });
    //     return userDB.rooms;
    // }

    async createRoom(body: CreateRoomDto, sessUser: SessionBodyDto) {
        const room: RoomDB = await this.dbOrm.in('rooms').addRow<RoomDB>([
            v4(), body.room_name, `[{"user_id": "${sessUser.user_id}", "role": "Creater"}]`, 'Public', '[]'
        ])
        const userDB: UserDB = await this.dbOrm.in('users').getRow({ user_id: sessUser.user_id });
        const user = 
            await this.dbOrm.in('users').updateRow({ rooms: [...convertObjArrToJSON(userDB.rooms), JSON.stringify({room_id: room.room_id, room_name: room.room_name})] },
            {user_id: sessUser.user_id});    
        const userDto = new UserDto(user) 
        console.log('сделал')
        return {userDto, room};
    }

    async getRoomLimit(limit: number) {
        const rooms: RoomDB[] = await this.dbOrm.in('rooms').getRowsLimit(0, limit);
        return rooms;
    }

    async enterRoom(room_id: string, sessUser: SessionBodyDto) {
        const room: RoomDB = await this.dbOrm.in('rooms').getRow({ room_id: room_id })
        if (!room) throw new BadRequestException('Комнаты с таким Id не существует')
        if (room.room_members.find((member) => member.user_id === sessUser.user_id)) throw new BadRequestException('Вы уже в группе')
        const userDB: UserDB = await this.dbOrm.in('users').getRow({ user_id: sessUser.user_id });
        const user = 
            await this.dbOrm.in('users').updateRow({ rooms: [...convertObjArrToJSON(userDB.rooms), JSON.stringify({room_id: room.room_id, room_name: room.room_name})] },
            {user_id: sessUser.user_id});
        const updateRoom = await this.dbOrm.in('rooms').updateRow({ room_members: [...convertObjArrToJSON(room.room_members), JSON.stringify(
            { 
                role: "Member",
                user_id: sessUser.user_id
            }
        )] }, { room_id: room_id })
        const userDto = new UserDto(user) 
        return {userDto, updateRoom};
    }

    async leaveTheRoom(room_id: string, sessUser: SessionBodyDto) {
        const room: RoomDB = await this.dbOrm.in('rooms').getRow({ room_id: room_id })
        if (!room) throw new BadRequestException('Комнаты с таким Id не существует')
        if (!room.room_members.find((member) => member.user_id === sessUser.user_id)) throw new BadRequestException('Вас нет в этой группе')
        const userDB: UserDB = await this.dbOrm.in('users').getRow({ user_id: sessUser.user_id });
        const user = 
            await this.dbOrm.in('users').updateRow({ rooms: [...convertObjArrToJSON(userDB.rooms.filter((room) => room.room_id !== room_id))] },
            {user_id: sessUser.user_id});
        const updateRoom = 
            await this.dbOrm.in('rooms').updateRow({ room_members: [...convertObjArrToJSON(room.room_members.filter((member) => member.user_id !== sessUser.user_id))]}, 
            { room_id: room_id })
        const userDto = new UserDto(user)
        return {userDto};
    }

    async removeRoom(body: RemoveRoomDto, sessUser: SessionBodyDto) {
        const room: RoomDB = await this.dbOrm.in('rooms').getRow({ room_id: body.room_id });
        const target = room.room_members.find((member) => {
            return member.user_id === sessUser.user_id;
        })
    }

    async getRoom(room_id: string, userSess: SessionBodyDto): Promise<RoomDB> {
        const userDB: UserDB = await this.dbOrm.in('users').getRow({user_id: userSess.user_id});
        const roomInUser = userDB.rooms.find((room) => {
            return room.room_id === room_id
        })
        if (!roomInUser) throw new BadRequestException('Вы не являетесь участником этой комнаты')
        const roomDB: RoomDB = await this.dbOrm.in('rooms').getRow({ room_id: room_id })
        return roomDB;
    }
} 