export class SessionBodyDto {
    user_id: string;
    email: string;
    constructor({ user_id, email }) {
        this.user_id = user_id;
        this.email = email;
    }
}