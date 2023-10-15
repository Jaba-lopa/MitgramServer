import { RoomMember, RoomType } from "./types/room.types";

export class RoomDB {
    room_id: string;
    room_name: string;
    room_members: RoomMember[];
    room_type: RoomType;
}