const express = require("express");
const dbConnect = require("./config/dbConnect");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/categoryRoute");
const brandRouter = require("./routes/brandRoute");
const enqRouter = require("./routes/enqRoute");
// const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
dbConnect();

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://auraluxe-20.netlify.app"],
  credentials: true,  // Allow credentials (cookies, auth headers)
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allow necessary headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow specific HTTP methods
};

app.use(cors(corsOptions));

// API Routes
app.use("/user", authRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/enquiry", enqRouter);

// Handle OPTIONS request (preflight)
app.options("*", (req, res) => {
  res.status(200).end();
});

// Fallback Route for 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (uncomment if available)
// app.use(notFound);
// app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
