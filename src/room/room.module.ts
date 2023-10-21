import { Module } from "@nestjs/common";
import { RoomService } from "./services/room.service";
import { RoomController } from "./controller/room.controller";
import { DBModule } from "src/db/db.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [DBModule, AuthModule],
    providers: [RoomService],
    controllers: [RoomController]
})
export class RoomModule {}