import { type RedisClientType } from 'redis';
/**
 * Return the Redis database client.
 *
 * Returns `null` if the connection cannot be established.
 */
export declare function cache(force?: boolean): Promise<RedisClientType | null>;
