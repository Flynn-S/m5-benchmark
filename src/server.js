import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./errors/errorHandling.js";

import mediaRoutes from "./media/index.js";
// import reviewRoutes from "./reviews/reviews.js";

const app = express();

// CORS ORIGIN WHITELIST
const port = process.env.PORT || 3001;
const whitelist = [process.env.FE_URL_DEV, process.env.FE_URL_PROD];
const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log("ORIGIN ", origin);
      // origin found in whitelist
      next(null, true);
    } else {
      // origin not found in the whitelist
      next(new Error("Not allowed by CORS (not found in whitelist)"));
    }
  },
};
app.use(cors(corsOptions));

app.use(express.json());

//ENDPOINTS / ROUTERS
app.use("/media", mediaRoutes);
// app.use("/reviews", reviewRoutes);

app.use(badRequestErrorHandler);
app.use(notFoundErrorHandler);
app.use(forbiddenErrorHandler);
app.use(catchAllErrorHandler);

console.log(listEndpoints(app));

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    // no need to configure it manually on Heroku
    console.log("Server running on cloud on port: ", port);
  } else {
    console.log("Server running locally on port: ", port);
  }
});
