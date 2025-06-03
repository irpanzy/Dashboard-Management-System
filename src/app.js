require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 jam
    },
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
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/", productRoute);
app.use("/", userRoute);

// VIEW ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

// Health check endpoint untuk Vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

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

// Untuk development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;
