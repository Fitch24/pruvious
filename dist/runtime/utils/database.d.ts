export type DatabaseInfo = {
    dialect: 'sqlite';
    storage: string;
} | ({
    dialect: 'postgres';
    database: string;
    host: string;
    port: number;
    username?: string;
    password?: string;
    ssl?: boolean;
} & Record<string, any>);
export declare function getDatabaseDialect(): 'postgres' | 'sqlite';
export declare function getDatabaseInfo(): DatabaseInfo;
export declare function indexName(table: string, columns: string | string[], unique?: boolean): string;
export declare function foreignKeyConstraintName(table: string, column: string): string;
