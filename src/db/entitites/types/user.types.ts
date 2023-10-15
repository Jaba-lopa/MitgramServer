import { Message } from "./common/message.type";

export interface Friend {
    user_id: string;
    messages: Message[];
}