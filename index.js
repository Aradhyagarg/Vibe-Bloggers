const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const categoryRoute = require("./routes/category");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


dotenv.config();
app.use(cors({
  origin:process.env.FRONTEND_URL,
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
  dbName: 'validate'
}).then(console.log("Connected to MongoDB")).catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.get('/', (req, res) => 
    res.send(`<h1>Site is Working. Click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend </h1>`)
);

app.listen("8000", () => {
  console.log("Backend is running.");
});