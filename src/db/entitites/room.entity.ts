import { MessageDB } from "./types/common/message.type";
import { RoomMember } from "./types/room.types";

export class RoomDB {
    room_id: string;
    room_name: string;
    room_members: RoomMember[];
    room_messages: MessageDB[];
}