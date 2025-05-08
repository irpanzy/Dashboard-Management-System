require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT;

// Routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

app.use(
  session({
    secret: "irpanzy",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Untuk parsing form dari EJS
app.use(methodOverride("_method"));
app.use(flash());

// Buat flash tersedia untuk semua view
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});

// View Engine Setup (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files (CSS, images, dll)
app.use(express.static("public"));

// API Routes
app.use("/", productRoute);
app.use("/", userRoute);

// VIEW ROUTES
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/", productRoute);
app.use("/", userRoute);

// Middleware to handle 404 errors (Page Not Found)
app.use((req, res, next) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    error: "404 Page not found",
  });
});

// Middleware to handle 500 errors (Server Errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "500 - Server Error",
    error: "500 Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
