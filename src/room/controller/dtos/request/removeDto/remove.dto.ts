import { IsNotEmpty, IsString } from "class-validator";

export class RemoveRoomDto {
    @IsNotEmpty()
    @IsString()
    room_id: string;
} 