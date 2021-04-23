import express from "express";
import { check, validationResult } from "express-validator";
import fs from "fs-extra";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 } from "cloudinary";
import { getMedia, writeMedia } from "../lib/fs-tools.js";

// const cloudinaryStorage = new CloudinaryStorage({
//     cloudinary: v2,
//     params: {
//       folder: "strive",
//     },
//   });

const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    const media = await getMedia();

    if (req.query && req.query.comment) {
      let filteredMedia = media.filter(
        (item) =>
          item.hasOwnProperty("comment") &&
          item.comment.includes(req.query.comment)
      );
      res.send(filteredMedia);
    } else if (req.query && req.query.rate) {
      let filteredMedia = media.filter(
        (item) =>
          item.hasOwnProperty("rate") && item.rate === parseInt(req.query.rate)
      );

      res.send(filteredMedia);
    } else {
      res.send(media);
    }
  } catch (error) {
    console.log(error);
    next(error); // SENDING ERROR TO ERROR HANDLERS (no httpStatusCode automatically means 500)
  }
});

route.get("/:id", async (req, res, next) => {
  //http://localhost:3002/media/123412312
  try {
    const media = await getMedia();

    const singularItem = media.find((item) => item.imdbID === req.params.id);
    if (singularItem) {
      res.send(singularItem);
    } else {
      const err = new Error("review not found");
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

route.post(
  "/",
  [
    check("Title").exists().isString().withMessage("Title must be a string"),
    check("Year")
      .exists()
      .isString()
      .withMessage("Year must be a string e.g. '2001'"),
    // check("imdbID").exists().withMessage("A imdbID must be included"),
    check("Type")
      .exists()
      .isString()
      .withMessage("Please specify the type of media e.g. 'movie' "),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // if we had errors
        const err = new Error();
        err.errorList = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const media = await getMedia();
        const newMedia = {
          ...req.body,
          imdbID: uniqid(),
          //   createdAt: new Date(),
        };

        media.push(newMedia);

        await writeMedia(media);

        res.status(201).send({ imdbID: newMedia.imdbID });
      }
    } catch (error) {
      error.httpStatusCode = 500;
      next(error);
    }
  }
);

route.put("/:id", async (req, res, next) => {
  try {
    const reqId = req.params.id;

    // const mediaToEdit = await fs.readJSON(reviewsDB);
    const existingArrayOfMedia = mediaToEdit.filter(
      (item) => item.imdbID !== reqId
    );

    const newArrayOfMedia = { ...req.body, id: reqId };
    existingArrayOfMedia.push(newArrayOfMedia);

    await writeMedia(newArrayOfMedia);
    //   await fs.writeJSON(mediaDB, newArrayOfMedia);
    res.status(201).send({ imdbID: newArrayOfMedia.imdbID });
  } catch (error) {
    console.log(error);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    const media = await getMedia();

    const newMedia = media.filter((item) => item.imdbID !== req.params.id);
    await writeMedia(newMedia);
    res.status(204).send();
  } catch (error) {
    console.log(error);
  }
});

export default route;
