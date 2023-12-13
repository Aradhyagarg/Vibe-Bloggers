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
const cloudinary = require("cloudinary").v2;


dotenv.config();
app.use(cors({
  origin:process.env.FRONTEND_URL,
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
//app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, {
  dbName: 'validate'
}).then(console.log("Connected to MongoDB")).catch((err) => console.log(err));

const storage = multer.memoryStorage(); // Use memory storage for multer

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.buffer.toString("base64"), {
      public_id: req.body.name,
    });

    // Access the Cloudinary URL from result.secure_url
    res.status(200).json({message: "File has been uploaded", imageUrl: result.secure_url});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error uploading file to Cloudinary", details: error.message});
  }
});
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });*/
/*app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});*/



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