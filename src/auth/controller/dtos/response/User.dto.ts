import { RoomInUser } from "src/db/entitites/types/user.types";

export class UserDto {
    user_id: string;
    email: string;
    username: string;
    rooms: RoomInUser[];
    friends: string[];
    register_date: string;
    constructor({ user_id, email, username, rooms, friends, register_date }) {
        this.user_id = user_id;
        this.email = email;
        this.username = username;
        this.rooms = rooms;
        this.friends = friends;
        this.register_date = register_date;
    }
}