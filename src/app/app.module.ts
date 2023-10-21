import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DBModule } from 'src/db/db.module';
import { RoomModule } from 'src/room/room.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [DBModule, AuthModule, SocketModule, RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}