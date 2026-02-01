const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// routes
const userRoutes = require("./routes/userroutes");
const productRoutes = require("./routes/productroutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistroutes");
const striperoutes = require("./routes/stripe.routes");

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
;app.use("/api/stripe", striperoutes);

// database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error", err));

// server
app.listen(3033, () => console.log("Server running at http://localhost:3033"));
