const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const userRoutes = require("./routes/userroutes");
app.use("/api/user", userRoutes);
const productroutes = require("./routes/productroutes");
app.use("/api/products", productroutes);
const cartroutes = require("./routes/cartRoutes");
app.use("/api/cart", cartroutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error", err));

app.listen(3033, () => console.log("Server running at http://localhost:3033"));
