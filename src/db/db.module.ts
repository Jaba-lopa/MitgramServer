import { Module } from "@nestjs/common";
import { PG_CONNECTION } from "src/app/constants/constants";
import { Pool } from 'pg';

const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new Pool({
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS
    })
}

@Module({
    exports: [dbProvider],
    providers: [dbProvider]
})
export class ModuleDB {}