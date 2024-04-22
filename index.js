const express = require("express");
const dbConnect = require("./config/dbConnect");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/categoryRoute");
const brandRouter = require("./routes/brandRoute");
const enqRouter = require("./routes/enqRoute");

const bodyParser = require("body-parser");
// const { notFound, errorHandler } = require('./middleware/errorHandler');
const error = require("mongoose/lib/error");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use("/user", authRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/enquiry", enqRouter);
app.use(cookieParser());

app.all("/*", function (req, res, next) {
  
  res.header("Access-Control-Allow-Origin", "http://localhost:5173/");
  res.header("Access-Control-Allow-Origin", "https://e-shopper24.netlify.app/");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});
// app.use(notFound);
// app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server is listening in ${PORT}`);
});
