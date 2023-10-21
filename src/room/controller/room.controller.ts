import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller('room')
export class RoomController {
    @Post('/joinRoom')
    async joinRoom(
        @Res() res: Response
    ) {
        try {
            return res.json({
                message: "Держи ответ!"
            })
        } catch(err) {
            return res.status(err.status).json({
                message: err.message,
                status: err.status
            })
        }
        
    }
}