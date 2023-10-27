import { IsNotEmpty, IsString } from "class-validator";

export class EnterTheRoomDto {
    @IsNotEmpty()
    @IsString()
    room_id: string;
}