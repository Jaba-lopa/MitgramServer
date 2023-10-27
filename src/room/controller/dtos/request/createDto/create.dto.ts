import { IsNotEmpty, IsString, Validate, ValidatorConstraintInterface } from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty()
    @IsString()
    room_name: string;
}