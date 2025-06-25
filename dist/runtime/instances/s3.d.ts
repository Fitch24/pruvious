import { S3Client } from '@aws-sdk/client-s3';
export declare function s3Client(): S3Client;
export declare function s3PutObject(key: string, body: string | Buffer, contentType: string): Promise<void>;
export declare function s3GetObject(key: string): Promise<Uint8Array<ArrayBufferLike> | undefined>;
export declare function s3MoveObject(from: string, to: string): Promise<void>;
export declare function s3DeleteObject(key: string): Promise<void>;
