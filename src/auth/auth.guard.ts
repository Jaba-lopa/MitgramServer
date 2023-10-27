import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Request } from 'express';
import { SessionBodyDto, SessionModel } from './controller/dtos/sessionBody.dto';
import { Session } from 'express-session';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        try {
            const session: SessionModel = req.session;
            const user: SessionBodyDto = session.user;
            if (!user) throw new UnauthorizedException('Вы не авторизованы')
            const { isAuth } = await this.authService.isAuth(`sess:${session.id}`, user);
            return isAuth;
        } catch (err) {
            throw new UnauthorizedException(err.message)
        } 
    }
}