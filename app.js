//external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");

//internal imports
const {notFoundHandler, errorHandler} = require("./middlewares/common/errorHandler");

const app = express();
dotenv.config();

//database connection
/** ------------ mongodb connection script deprecated ----------- */
// mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {console.log("database connection successful")})
// .catch(err => {console.log(err)});

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Database Connection Successful.");
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
app.use('/', authRouter);
// app.use('/dashboard', loginRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handling
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});