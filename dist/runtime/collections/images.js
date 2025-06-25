import { primaryLanguage } from "#pruvious";
import fs from "fs-extra";
import { hash as _hash } from "ohash";
import path from "path";
import sharp from "sharp";
import { db } from "../instances/database.js";
import { s3GetObject, s3PutObject } from "../instances/s3.js";
import { getModuleOption } from "../instances/state.js";
import { objectPick } from "../utils/object.js";
import { __ } from "../utils/server/translate-string.js";
import { joinRouteParts } from "../utils/string.js";
import { imageTypes } from "../utils/uploads.js";
export async function getOptimizedImage(upload, options, contextLanguage) {
  if (!imageTypes.includes(upload.type)) {
    return {
      success: false,
      error: __(contextLanguage ?? primaryLanguage, "pruvious-server", "The upload is not an image")
    };
  }
  const resolvedOptions = options.format === "jpeg" ? { quality: options.quality ?? 80 } : options.format === "webp" ? {
    quality: options.quality ?? 80,
    alphaQuality: options.alphaQuality ?? 100,
    lossless: options.lossless ?? false,
    nearLossless: options.nearLossless ?? false,
    smartSubsample: options.smartSubsample ?? false
  } : {};
  resolvedOptions.format = options.format;
  resolvedOptions.width = options.width ?? null;
  resolvedOptions.height = options.height ?? null;
  resolvedOptions.resize = options.resize ?? "cover";
  resolvedOptions.withoutEnlargement = options.withoutEnlargement ?? false;
  resolvedOptions.withoutReduction = options.withoutReduction ?? false;
  resolvedOptions.position = options.position ?? "center";
  resolvedOptions.interpolation = options.interpolation ?? "lanczos3";
  const uploadsOptions = getModuleOption("uploads");
  const hash = _hash(resolvedOptions);
  const image = await (await db()).model("_optimized_images").findOne({ where: { upload_id: upload.id, hash } });
  const paths = generateImagePaths(upload.directory, upload.filename, hash, options.format);
  let width = image?.width ?? resolvedOptions.width;
  let height = image?.height ?? resolvedOptions.height;
  if (!image) {
    try {
      const uploadsDir = path.resolve(getModuleOption("uploadsDir"));
      const original = uploadsOptions.drive.type === "local" ? fs.readFileSync(path.resolve(joinRouteParts(uploadsDir, upload.directory, upload.filename))) : await s3GetObject(joinRouteParts(upload.directory, upload.filename));
      const sharpImage = sharp(original);
      if (resolvedOptions.format === "png") {
        sharpImage.png();
      } else if (resolvedOptions.format === "webp") {
        sharpImage.webp(
          objectPick(resolvedOptions, ["quality", "alphaQuality", "lossless", "nearLossless", "smartSubsample"])
        );
      } else {
        sharpImage.jpeg(objectPick(resolvedOptions, ["quality"]));
      }
      sharpImage.resize({
        width: resolvedOptions.width ?? void 0,
        height: resolvedOptions.height ?? void 0,
        fit: resolvedOptions.resize,
        withoutEnlargement: resolvedOptions.withoutEnlargement,
        withoutReduction: resolvedOptions.withoutReduction,
        position: resolvedOptions.position === "center" ? "centre" : resolvedOptions.position === "topRight" ? "right top" : resolvedOptions.position === "bottomRight" ? "right bottom" : resolvedOptions.position === "bottomLeft" ? "left bottom" : resolvedOptions.position === "topLeft" ? "left top" : resolvedOptions.position,
        kernel: resolvedOptions.interpolation
      });
      const imageBuffer = await sharpImage.toBuffer({ resolveWithObject: true });
      width = imageBuffer.info.width;
      height = imageBuffer.info.height;
      if (uploadsOptions.drive.type === "local") {
        fs.writeFileSync(path.resolve(paths.drive), imageBuffer.data);
      } else {
        await s3PutObject(
          paths.drive,
          imageBuffer.data,
          resolvedOptions.format === "jpeg" ? "image/jpeg" : resolvedOptions.format === "webp" ? "image/webp" : "image/png"
        );
      }
      await (await db()).model("_optimized_images").create({ upload_id: upload.id, hash, ...resolvedOptions, width, height });
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  return { success: true, src: paths.public, width, height };
}
export function generateImagePaths(directory, filename, hash, format) {
  const options = getModuleOption("uploads");
  const uploadsDir = path.resolve(getModuleOption("uploadsDir"));
  const basename = filename.includes(".") ? filename.split(".").slice(0, -1).join(".") : filename;
  const extension = format === "jpeg" ? "jpg" : format === "webp" ? "webp" : "png";
  const imageFilename = `${basename}_${hash}.${extension}`;
  return options.drive.type === "local" ? {
    filename: imageFilename,
    drive: joinRouteParts(uploadsDir, directory, imageFilename),
    public: joinRouteParts(
      getModuleOption("baseUrl"),
      options.drive.urlPrefix ?? "uploads",
      directory,
      imageFilename
    )
  } : {
    filename: imageFilename,
    drive: joinRouteParts(directory, imageFilename),
    public: options.drive.baseUrl + directory + imageFilename
  };
}
