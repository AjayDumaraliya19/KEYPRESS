const multer = require("multer");
const express = require("express");

const app = express();

app.use(express.json());

/* --------------------- Create the upload function here -------------------- */
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, File, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.filename + "-" + Date.now() + ".jpg");
    },
  }),
}).single("image");

app.post("/upload", upload, (req, res) => {
  res.send("File uploaded..!");
});

app.listen(5000, () => {
  console.log("Server running at port 5000...");
});
