import { Controller, Post, Get, Session, Res, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from './dtos/request/register.dto';
import { LoginDto } from './dtos/request/login.dto';
import { client } from 'src/redis/RedisStorage';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UsePipes(new ValidationPipe())
    @Post('/register')
    async registration(
        @Res() res: Response,
        @Body() body: RegisterDto,
        @Session() session: any
    ) {
        try {
            const { email, password, username } = body;
            const { userDto, sessionBodyDto } = await this.authService.registration(email, password, username);
            session.user = JSON.stringify({
                ...sessionBodyDto
            })
            return res.json(userDto);
        } catch (err) {
            return res.status(err.status).json({
                message: err.message,
                status: err.status
            })
        }
        
    }

    @UsePipes(new ValidationPipe())
    @Post('/login')
    async login(
        @Res() res: Response,
        @Body() body: LoginDto,
        @Session() session: any
    ) {
        const { email, password } = body;
        const { userDto, sessionBodyDto } = await this.authService.login(email, password);
        session.user = JSON.stringify({
            ...sessionBodyDto
        })
        return res.json(userDto);
    }

    @UsePipes(new ValidationPipe())
    @Get('/logout')
    async logout(
        @Res() res: Response,
        @Session() session: any
    ) {
        session.destroy();
        
        return res.json({
            message: "Вы успешно вышли из аккаунта",
            status: 200
        });
    }

    @UsePipes(new ValidationPipe())
    @Get('/isAuth')
    async isAuth(
        @Res() res: Response,
        @Session() session: Record<string, any>
    ) {
        if (!session.user) return res.json({ isAuth: false })
        const { isAuth, user } = await this.authService.isAuth(`sess:${session.id}`, JSON.parse(session.user));
        return res.json({
            isAuth,
            user
        })
    }
}