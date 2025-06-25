import { type CastedFieldType, type SupportedLanguage } from '#pruvious';
interface BaseOptimizedImage {
    /**
     * The width of the image in pixels.
     * Use `null` or `undefined` to auto-scale the width to match the height.
     *
     * Defaults to the original image's width.
     */
    width?: number | null;
    /**
     * The height of the image in pixels.
     * Use `null` or `undefined` to auto-scale the width to match the height.
     *
     * Defaults to the original image's height.
     */
    height?: number | null;
    /**
     * The resizing mode to identify how an image should be resized.
     *
     * - `contain` - Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
     * - `cover` - Preserving aspect ratio, attempt to ensure the image covers both provided dimensions by cropping/clipping to fit.
     * - `fill` - Ignore the aspect ratio of the input and stretch to both provided dimensions.
     * - `inside` - Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
     * - `outside` - Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
     *
     * @default 'cover'
     */
    resize?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
    /**
     * Do not scale up if the width or height are already less than the target dimensions.
     * This may result in output dimensions smaller than the target dimensions.
     *
     * @default false
     */
    withoutEnlargement?: boolean;
    /**
     * Do not scale down if the width or height are already greater than the target dimensions.
     * This may still result in a crop to reach the target dimensions.
     *
     * @default false
     */
    withoutReduction?: boolean;
    /**
     * The position for the image when resized and cropped.
     *
     * @default 'center'
     */
    position?: 'center' | 'top' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left' | 'topLeft';
    /**
     * The interpolation algorithm used in resizing.
     *
     * @default 'lanczos3'
     */
    interpolation?: 'cubic' | 'lanczos2' | 'lanczos3' | 'mitchell' | 'nearest';
}
interface JpegOptimizedImage extends BaseOptimizedImage {
    /**
     * Image format - jpeg, png, or webp.
     */
    format: 'jpeg';
    /**
     * The quality of the image after compression (0 is worst, 100 is best).
     * Only applies to `jpeg` and `webp`.
     *
     * @default 80
     */
    quality?: number;
}
interface PngOptimizedImage extends BaseOptimizedImage {
    /**
     * Image format - jpeg, png, or webp.
     */
    format: 'png';
}
interface WebpOptimizedImage extends BaseOptimizedImage {
    /**
     * Image format - jpeg, png, or webp.
     */
    format: 'webp';
    /**
     * The quality of the image after compression (0 is worst, 100 is best).
     * Only applies to `jpeg` and `webp`.
     *
     * @default 80
     */
    quality?: number;
    /**
     * The quality of the image's alpha layer after compression.
     * Only applies to `webp`.
     *
     * @default 100
     */
    alphaQuality?: number;
    /**
     * If true, the image is compressed without any degradation in quality.
     * Only applicable for `webp` image format.
     *
     * @default false
     */
    lossless?: boolean;
    /**
     * If true, the image is compressed in a manner between total lossy and lossless.
     * Only applies to `webp`.
     *
     * @default false
     */
    nearLossless?: boolean;
    /**
     * If true, apply subsampling to improve image size reduction.
     * Only applies to `webp`.
     *
     * @default false
     */
    smartSubsample?: boolean;
}
export type OptimizedImage = JpegOptimizedImage | PngOptimizedImage | WebpOptimizedImage;
export type ImageSource = OptimizedImage & {
    /**
     * The media query of the image source or `null` if not specified.
     *
     * @example '(max-width: 768px)'
     */
    media?: string | null;
};
export interface OptimizedImageSource {
    /**
     * The URL or absolute path of the image source.
     */
    srcset: string;
    /**
     * The width of the image source in pixels.
     */
    width: number;
    /**
     * The height of the image source in pixels.
     */
    height: number;
    /**
     * The MIME type of the image source.
     */
    type: string;
    /**
     * The media query of the image source or `null` if not specified.
     */
    media: string | null;
}
export interface Image {
    /**
     * The URL or absolute path to the optimized image.
     */
    src: string;
    /**
     * The alternative text of the image.
     */
    alt: string;
    /**
     * The width of the image in pixels.
     */
    width: number;
    /**
     * The height of the image in pixels.
     */
    height: number;
    /**
     * The MIME type of the image.
     */
    type: string;
    /**
     * An array of optimized image sources.
     */
    sources: OptimizedImageSource[];
}
/**
 * Optimize an image `upload` with the given `options`.
 *
 * Returns `null` if the `upload` is not an image.
 * Otherwise, returns an object with the following properties:
 *
 * - `success` - Whether the image was successfully optimized.
 * - `src` - The URL or absolute path to the optimized image.
 *
 * @example
 * ```typescript
 * // Convert an image to webp format with 92% quality
 * const upload = await query('uploads').select({ id: true, directory: true, filename: true, type: true }).first()
 * const optimizedImage = await getOptimizedImage(upload, { format: 'webp', quality: 92 })
 * // Output: { success: true, src: '/uploads/foo/bar/test_1234567890.webp' }
 * ```
 */
export declare function getOptimizedImage(upload: Pick<CastedFieldType['uploads'], 'id' | 'directory' | 'filename' | 'type'>, options: OptimizedImage, contextLanguage?: SupportedLanguage): Promise<{
    /**
     * Whether the image was successfully optimized.
     */
    success: true;
    /**
     * The URL or absolute path to the optimized image.
     */
    src: string;
    /**
     * The width of the optimized image.
     */
    width: number;
    /**
     * The height of the optimized image.
     */
    height: number;
} | {
    /**
     * The error that occurred during optimization.
     */
    success: false;
    /**
     * The error that occurred during optimization.
     */
    error: string;
}>;
export declare function generateImagePaths(directory: string, filename: string, hash: string, format: OptimizedImage['format']): {
    filename: string;
    drive: string;
    public: string;
};
export {};
