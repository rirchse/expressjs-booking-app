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
// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
//   // console.log("Database Connection Successful.");
// }

const uri = "mongodb+srv://mrirstt:z9mPjt7DbrClQ9KG@cluster0.e8jqd.mongodb.net/ejs-booking-app?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);
//---------------- db connection ended --------

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