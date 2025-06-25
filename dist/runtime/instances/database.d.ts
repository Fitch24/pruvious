import { Sequelize } from 'sequelize';
import 'sqlite3';
import type { ResolvedCollectionDefinition } from '../collections/collection.definition.js';
import type { ResolvedFieldDefinition } from '../fields/field.definition.js';
export declare const opMap: {
    '=': symbol;
    '!=': symbol;
    '>': symbol;
    '>=': symbol;
    '<': symbol;
    '<=': symbol;
    between: symbol;
    notBetween: symbol;
    in: symbol;
    notIn: symbol;
    like: symbol;
    notLike: symbol;
    iLike: symbol;
    notILike: symbol;
};
export declare const opMapSqlite: {
    iLike: symbol;
    notILike: symbol;
    '=': symbol;
    '!=': symbol;
    '>': symbol;
    '>=': symbol;
    '<': symbol;
    '<=': symbol;
    between: symbol;
    notBetween: symbol;
    in: symbol;
    notIn: symbol;
    like: symbol;
    notLike: symbol;
};
/**
 * Return the Sequelize database client.
 */
export declare function db(): Promise<Sequelize>;
/**
 * Recreate the database instance by rebuilding all tables, columns, indexes, and constraints.
 */
export declare function rebuildDatabase(fields: Record<string, ResolvedFieldDefinition>, collections: Record<string, ResolvedCollectionDefinition>, log?: boolean): Promise<Sequelize>;
