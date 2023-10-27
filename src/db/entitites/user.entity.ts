import { Friend, RoomInUser } from "./types/user.types";

export class UserDB {
    user_id: string;
    email: string;
    username: string;
    password: string;
    rooms: RoomInUser[];
    friends: Friend[];
    register_date: string;
}