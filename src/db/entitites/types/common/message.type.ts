export class MessageReq {
    user_id: string;
    username: string;
    message: string;
    room_id: string
    constructor(user_id, message, username, room_id) {
        this.user_id = user_id;
        this.message = message;
        this.username = username;
        this.room_id = room_id;
    }
}
export class MessageDB extends MessageReq {
    date: string;
    constructor({user_id, message, date, username, room_id}) {
        super(user_id, message, username, room_id)
        this.date = date
    }
}