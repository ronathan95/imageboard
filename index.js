const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        uidSafe(24)
            .then((uid) => {
                callback(null, `${uid}${path.extname(file.originalname)}`);
            })
            .catch((err) => {
                callback(err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error on db.getImages: ", err);
            res.json({ success: false });
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        const newImage = {
            title: req.body.title,
            description: req.body.description,
            username: req.body.username,
            url: s3Url + req.file.filename,
        };
        db.insertNewImage(
            newImage.url,
            newImage.username,
            newImage.title,
            newImage.description
        )
            .then(() => {
                res.json(newImage);
            })
            .catch((err) => {
                console.error("error on db.insertNewImage: ", err);
            });
    } else {
        res.json({ success: false });
    }
});

app.listen(8080, () => console.log("Imageboard up and running on 8080"));
