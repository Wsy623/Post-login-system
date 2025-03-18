const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("Connecting to MongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

//Set up middleware and EJS viewengine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running at Port ${port}...`);
});
