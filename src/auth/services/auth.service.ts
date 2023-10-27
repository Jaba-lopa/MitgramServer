import { Injectable, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PG_CONNECTION } from 'src/app/constants/constants';
import DBOrm from 'src/db/dbOrm/dbOrm';
import { UserDB } from 'src/db/entitites/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { UserDto } from '../controller/dtos/response/User.dto';
import { SessionBodyDto } from '../controller/dtos/sessionBody.dto';
import { client } from 'src/redis/RedisStorage';
import { BanListEntity } from 'src/db/entitites/banlist.entity';

@Injectable()
export class AuthService {
    constructor(@Inject(PG_CONNECTION) private dbOrm: DBOrm) {}

    async registration(email: string, password: string, username: string) {
        const candidate: UserDB = await this.dbOrm.in('users').getRow({ email: email });
        if (candidate) throw new BadRequestException('Пользователь с такой почтой уже зарегистрирован');
        const hashPass = await bcrypt.hash(password, 5);
        const userDB: UserDB = await this.dbOrm.in('users').addRow(
           [v4(), email, username, hashPass, [], [], new Date().toLocaleDateString()]
        )
        const userDto = new UserDto(userDB);
        const sessionBodyDto = new SessionBodyDto(userDB);
        return {
            userDto,
            sessionBodyDto
        }
    }
    async login(email: string, password: string) {
        const candidate: UserDB = await this.dbOrm.in('users').getRow({ email: email });
        if (!candidate) throw new BadRequestException('Неправильная почта или пароль');

        const userInBanlist = await this.dbOrm.in('banlist').getRow({ user_id: candidate.user_id });
        if (userInBanlist) throw new ForbiddenException('Аккаунт недоступен')

        const isEqualPassword: boolean = await bcrypt.compare(password, candidate.password);
        if (!isEqualPassword) throw new BadRequestException('Неправильная почта или пароль')
        
        const userDto = new UserDto(candidate);
        const sessionBodyDto = new SessionBodyDto(candidate);
        return {
            userDto,
            sessionBodyDto
        }
    }
    async isAuth(redisKey: RedisKey, sessionBodyDto: SessionBodyDto) {
        // Верифицировать данные по ключу в redis
        const userDataInRedis = JSON.parse(await client.get(redisKey));
        const userInRedis: SessionBodyDto = userDataInRedis.user;
        if (sessionBodyDto.email != userInRedis.email || sessionBodyDto.user_id != userInRedis.user_id) return { isAuth: false };
        // Забанен ли пользователь
        const candidate: BanListEntity = await this.dbOrm.in('banlist').getRow({ user_id: sessionBodyDto.user_id });
        if (candidate) return { isAuth: false };
        const userDB = await this.dbOrm.in('users').getRow({ email: sessionBodyDto.email });
        return {
            isAuth: true,
            user: new UserDto(userDB as UserDto)
        };
    }
}
type RedisKey = `sess:${string}`;