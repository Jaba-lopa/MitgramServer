import RedisStore from "connect-redis";
import { createClient } from "redis";

export const client = createClient({});
export const RedisStorage = new RedisStore({
    client: client
})