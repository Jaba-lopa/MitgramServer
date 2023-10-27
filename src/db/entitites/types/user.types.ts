import { MessageDB } from "./common/message.type";

export interface Friend {
    user_id: string;
    messages: MessageDB[];
}

export interface RoomInUser {
    room_id: string;
    room_name: string;
} 