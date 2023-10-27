import { Controller, Post, Get, Res, Body, UseGuards, UsePipes, ValidationPipe, Session } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateRoomDto } from "./dtos/request/createDto/create.dto";
import { RoomService } from "../services/room.service";
import { SessionModel } from "src/auth/controller/dtos/sessionBody.dto";
import { RemoveRoomDto } from "./dtos/request/removeDto/remove.dto";
import { GetRoomDto } from "./dtos/request/getRoomDto/get.dto";
import { EnterTheRoomDto } from "./dtos/request/enterDto/enter.dto";

@UseGuards(AuthGuard) 
@Controller('room')
export class RoomController {
    constructor (private roomService: RoomService) {}
    @UsePipes(new ValidationPipe())
    @Post('createRoom')
    async createRoom(
        @Res() res: Response,
        @Body() body: CreateRoomDto,
        @Session() session: SessionModel 
    ) {
        try {
            const { room, userDto } = await this.roomService.createRoom(body, session.user)
            return res.json({
                room,
                user: userDto
            })
        } catch(err) {
            console.log('err: ', err)
            return res.status(err.status).json({
                message: err.message,
                status: err.status
            })
        }
    }

    @UsePipes(new ValidationPipe())
    @Post('getRoomsLimit')
    async getRoomsLimit(
        @Res() res: Response,
        @Body() body: {
            limit: number;
        },
        @Session() session: SessionModel
    ) {
        const rooms = await this.roomService.getRoomLimit(body.limit);
        return res.json({
            rooms: rooms
        })
    }
    @UsePipes(new ValidationPipe())
    @Post('enterTheRoom')
    async enterRoom(
        @Res() res: Response,
        @Body() body: EnterTheRoomDto,
        @Session() session: SessionModel
    ) {
        try {
            const { updateRoom, userDto } = await this.roomService.enterRoom(body.room_id, session.user)
            return res.json({
                updateRoom,
                user: userDto
            }) 
        } catch(err) {
            return res.status(err.status).json({
                message: err.message,
                status: err.status
            })
        }
    } 

    @UsePipes(new ValidationPipe())
    @Post('leaveTheRoom')
    async leaveTheRoom(
        @Res() res: Response,
        @Body() body: {
            room_id: string;
        },
        @Session() session: SessionModel
    ) {
        try {
            const { userDto } = await this.roomService.leaveTheRoom(body.room_id, session.user)
            return res.json({
                user: userDto
            })
        } catch(err) {
            return res.status(err.status).json({
                message: err.message,
                status: err.status
            })
        }
    }

    @UsePipes(new ValidationPipe())
    @Post('getRoom')
    async getRoom( 
        @Res() res: Response,
        @Body() body: GetRoomDto,
        @Session() session: SessionModel
    ) {
        try {
            const room = await this.roomService.getRoom(body.room_id, session.user);
            return res.json({room})
        } catch(err) {
            return res.status(err.status).json({
                message: err.message,
                status: err.status
            })
        }
    }
    @UsePipes(new ValidationPipe())
    @Post('removeRoom')
    async removeRoom(
        @Res() res: Response,
        @Body() body: RemoveRoomDto,
        @Session() session: SessionModel
    ) {
        const room = await this.roomService.removeRoom(body, session.user)
        return res.json(room)
    }
}