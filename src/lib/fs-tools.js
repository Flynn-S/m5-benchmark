import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../db");

const publicMediaDB = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public"
); // THIS SHOULD BE SPECIFIC TO THE FOLDER FOR MEDIA IMAGES

// console.log(mediaFolderPathLuca)
console.log(publicMediaDB);

// CRUD FILE PATHS

// MEDIA PATHS
export const getMedia = async () =>
  await readJSON(join(dataFolderPath, "media.json"));

export const writeMedia = async (content) =>
  await writeJSON(join(dataFolderPath, "media.json"), content);

export const getMediaReadStream = () =>
  fs.createReadStream(join(dataFolderPath, "media.json"));

export const writeMediaPictures = async (fileName, content) =>
  await writeFile(join(publicMediaDB, fileName), content);

export const readMediaPictures = (fileName) =>
  createReadStream(join(publicMediaDB, fileName));

// REVIEWS PATHS
export const getReviews = async () =>
  await readJSON(join(dataFolderPath, "reviews.json"));

export const writeReviews = async (content) =>
  await writeJSON(join(dataFolderPath, "reviews.json"), content);

//CURRENT FOLDER PATH
export const getCurrentFolderPath = (currentFile) =>
  dirname(fileURLToPath(currentFile));
