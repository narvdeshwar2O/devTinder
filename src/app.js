const express = require("express");
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const { RequestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", RequestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(8000, () => {
      console.log("Server is running on the port 8000");
    });
  })
  .catch((err) => {
    console.log(
      "Unable to connect with database Kindly contact Administartor.",
      err
    );
  });
