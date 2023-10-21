import { Module, forwardRef } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { UserUseService } from "./services/uus.service";
import { ServerUseService } from "./services/sus.service";
import { DBModule } from "src/db/db.module";

@Module({
    providers: [SocketGateway, ServerUseService, UserUseService],
    imports: [DBModule]
})
export class SocketModule {}