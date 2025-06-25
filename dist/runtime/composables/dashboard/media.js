import { useState } from "#imports";
import { toArray } from "../../utils/array.js";
import {
  addMediaDirectories,
  moveMediaDirectory
} from "../../utils/dashboard/media-directory.js";
import { pruviousFetch } from "../../utils/fetch.js";
import { isObject } from "../../utils/object.js";
import { __ } from "../translatable-strings.js";
import { pruviousToasterShow } from "./toaster.js";
export const useUploadDialog = () => useState("pruvious-upload-dialog", () => ({
  accept: void 0,
  directory: ""
}));
export const useMediaLibraryPopup = () => useState("pruvious-media-library-popup", () => null);
export const useMediaUploadPopup = () => useState("pruvious-media-upload-popup", () => null);
export const useMediaDirectoryPopup = () => useState("pruvious-media-directory-popup", () => null);
export const useMediaClear = () => useState("pruvious-media-clear", () => 0);
export const useMediaUpdated = () => useState("pruvious-media-updated", () => 0);
export const useLastMediaDirectory = () => useState("pruvious-last-media-directory", () => "");
export const useMediaDirectories = () => useState("previous-media-directories", () => ({}));
export function openUploadDialog(directory, accept) {
  useUploadDialog().value = {
    accept: accept?.map((type) => !type.includes("/") && !type.startsWith(".") ? `.${type}` : type).join(",").toLowerCase(),
    directory
  };
}
export function openMediaLibraryPopup(options = {}) {
  useMediaLibraryPopup().value = options;
}
export function closeMediaLibraryPopup() {
  useMediaLibraryPopup().value = null;
}
export function editMediaUpload(upload2) {
  useMediaUploadPopup().value = { upload: upload2 };
}
export function createMediaDirectory(parentDirectory) {
  useMediaDirectoryPopup().value = { action: "create", parentDirectory };
}
export function renameMediaDirectory(directory) {
  useMediaDirectoryPopup().value = { action: "rename", directory };
}
export async function upload(input) {
  const entries = toArray(input);
  const promises = [];
  for (const entry of entries) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(entry)) {
      if (key === "$file") {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
    promises.push(pruviousFetch("collections/uploads", { method: "post", body: formData }));
  }
  const responses = await Promise.all(promises);
  let uploaded = 0;
  for (const [i, response] of responses.entries()) {
    if (response.success) {
      uploaded++;
    } else if (isObject(response.error)) {
      pruviousToasterShow({
        message: `**${entries[i].filename ?? entries[i].$file.name}:** ` + Object.values(response.error).join("<br>"),
        type: "error"
      });
    }
  }
  return uploaded;
}
export async function moveSelection(selection, to) {
  if (!selection.count) {
    return false;
  }
  let from = (Object.keys(selection.directories.value)[0] ?? Object.values(selection.uploads.value)[0]?.directory).slice(0, -1).split("/").slice(0, -1).join("/") + "/";
  from = from === "/" ? "" : from;
  const mediaDirectories = useMediaDirectories();
  const promises = [];
  for (const upload2 of Object.values(selection.uploads.value)) {
    promises.push({
      promise: pruviousFetch(`collections/uploads/${upload2.id}`, {
        method: "patch",
        body: { directory: to, filename: upload2.filename }
      }),
      upload: upload2
    });
  }
  for (const directory of Object.keys(selection.directories.value)) {
    const response = await pruviousFetch("collections/uploads", {
      query: { where: `some:[directory[=][${directory}],directory[like][${directory}%]]` }
    });
    if (response.success) {
      moveMediaDirectory(directory, to, mediaDirectories.value);
      for (const upload2 of response.data.records) {
        promises.push({
          promise: pruviousFetch(`collections/uploads/${upload2.id}`, {
            method: "patch",
            body: { directory: upload2.directory.replace(from, to), filename: upload2.filename }
          }),
          upload: upload2
        });
      }
    } else {
      selection.deselectDirectory(directory);
    }
  }
  const responses = await Promise.all(promises.map(({ promise }) => promise));
  for (const [i, response] of responses.entries()) {
    if (!response.success) {
      if (isObject(response.error) && response.error.filename) {
        setTimeout(() => {
          pruviousToasterShow({
            message: __(
              "pruvious-dashboard",
              "A file with the name !!$name!! already exists in the destination folder",
              { name: promises[i].upload.filename }
            ),
            type: "error"
          });
        });
      }
      selection.deselectUpload(promises[i].upload);
    }
  }
  if (selection.count.value) {
    pruviousToasterShow({
      message: __("pruvious-dashboard", "Moved $count $items", {
        count: selection.count.value,
        items: selection.currentType.value
      })
    });
    selection.deselectAll();
    useMediaUpdated().value++;
    return true;
  }
  return false;
}
export async function fetchDirectories() {
  const response = await pruviousFetch("collections/uploads", {
    query: { select: "directory", order: "directory", group: "directory" }
  });
  if (response.success) {
    for (const { directory } of response.data.records) {
      addMediaDirectories(directory, useMediaDirectories().value);
    }
  }
}
