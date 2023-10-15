import { Friend } from "./types/user.types";

export class UserDB {
    user_id: string;
    email: string;
    username: string;
    password: string;
    rooms: string[];
    friends: Friend[];
    register_date: string;
}