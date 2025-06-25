import { jobs } from '#pruvious/server';
import type { RuntimeConfig } from '@nuxt/schema';
import type { JobAfterProcessContext } from './job.definition.js';
interface JobEntry<T extends keyof typeof jobs> {
    id: number;
    name: T;
    args: Parameters<(typeof jobs)[T]['callback']>;
    jti: string;
    priority: number;
    createdAt: number;
}
export declare function initJobQueueProcessing(runtimeConfig: RuntimeConfig): void;
/**
 * Immediately create and process a job with the specified `name` and its callback arguments.
 *
 * @returns A promise that resolves to an object containing information about the job processing,
 *          including the `success` state, `duration` in milliseconds, `processedAt` timestamp,
 *          and the `response` of the job callback function if successful, or an `error` if not.
 *
 * @see https://pruvious.com/docs/jobs
 */
export declare function processJob<T extends keyof typeof jobs>(name: T, ...args: Parameters<(typeof jobs)[T]['callback']>): Promise<JobAfterProcessContext<(typeof jobs)[T]['callback']>>;
/**
 * Initiate a job prcessing request.
 * Jobs are processed based on their `priority` and age, giving precedence to the oldest jobs.
 * This function continuously processes jobs until none are left.
 *
 * @see https://pruvious.com/docs/jobs
 */
export declare function processJobQueue(): Promise<void>;
/**
 * Create a job with the specified `name` and its callback arguments, and enqueue it for processing.
 * Workers periodically search for and process new jobs in the queue.
 *
 * @see https://pruvious.com/docs/jobs
 */
export declare function queueJob<T extends keyof typeof jobs>(name: T, ...args: Parameters<(typeof jobs)[T]['callback']>): Promise<JobEntry<T>>;
export {};
