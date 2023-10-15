import { Module } from "@nestjs/common";
import { PG_CONNECTION } from "src/app/constants/constants";
import { Pool } from 'pg';
import DBOrm from "./dbOrm/dbOrm";
import { config } from "dotenv";
config()
const pool = new Pool({
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS
})
const dbProvider = {
    provide: PG_CONNECTION,
    useValue: new DBOrm(pool)
}

@Module({
    exports: [dbProvider],
    providers: [dbProvider]
})
export class DBModule {}