import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controller/auth.controller";
import { DBModule } from "src/db/db.module";

@Module({
    imports: [DBModule],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}