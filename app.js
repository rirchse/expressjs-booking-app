//external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

// web routers
const authRouter = require("./routers/authRouter");
const pageRouter = require("./routers/pageRouter");
const userRouter = require("./routers/userRouter");

//api routers
const apiAuthRouter = require("./routers/api/apiAuthRouter");
// const apiUserRouter = require("./routers/api/apiUserRouter");

//internal imports
const {notFoundHandler, errorHandler} = require("./middlewares/common/errorHandler");

const app = express();
dotenv.config();

//database connection
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  // console.log("Database Connection Successful.");
}

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// router setup
app.use("/", pageRouter);
app.use("/", authRouter);
app.use("/", userRouter);

// api routes
app.use("/api", apiAuthRouter);
// app.use("/api", apiUserRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handling
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});