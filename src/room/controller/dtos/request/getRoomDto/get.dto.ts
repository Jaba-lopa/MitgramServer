import { IsNotEmpty, IsString } from "class-validator";

export class GetRoomDto {
    @IsNotEmpty()
    @IsString()
    room_id: string;
}