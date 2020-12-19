const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

////////////////////////////////////////////////////////////////////

app.use(
    express.json({
        extended: false,
    })
);

////////////////////////////////////////////////////////////////////

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

async function fileFilter(req, file, callback) {
    const { mimetype, originalname } = file;

    if (!mimetype.startsWith("image/")) {
        console.error(
            `fileFilter: Invalid mimetype ${mimetype} for file ${originalname}`
        );
        req.wrongFileType = true;
        return callback(null, false);
    }

    return callback(null, true);
}

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
    fileFilter,
});

//middleare with an extra arg - error (4 arg, express knows it's an err handler)

////////////////////////////////////////////////////////////////////

app.use(express.static("public"));

////////////////////////////////////////////////////////////////////

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error on db.getImages: ", err);
            res.json({
                error: true,
                message: "error on getting images from DB",
            });
        });
});

app.get("/image-info/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getImageInfo(imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error on db.getImageInfo: ", err);
            res.json({
                error: true,
                message: "error on getting image-info from DB",
            });
        });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    // req.wrongFileType = true; --> check it
    if (req.file) {
        const newImage = {
            title: req.body.title,
            description: req.body.description,
            username: req.body.username,
            url: s3Url + req.file.filename,
            id: "",
        };
        db.insertNewImage(
            newImage.url,
            newImage.username,
            newImage.title,
            newImage.description
        )
            .then((imageId) => {
                newImage.id = imageId.rows[0].id;
                res.json(newImage);
            })
            .catch((err) => {
                console.error("error on db.insertNewImage: ", err);
                res.json({
                    error: true,
                    message: "error on inserting new image to DB",
                });
            });
    } else {
        res.json({ error: true });
    }
});

app.get("/show-more/:lastImageId", (req, res) => {
    const { lastImageId } = req.params;
    db.getMoreImages(lastImageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error on db.getMoreImages: ", err);
            res.json({
                error: true,
                message: "error on getting more images from DB",
            });
        });
});

app.get("/comments/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getComments(imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error on db.getComments: ", err);
            res.json({
                error: true,
                message: "error on getting comments from DB",
            });
        });
});

app.post("/new-comment", (req, res) => {
    const { imageId, comment, username } = req.body;
    const newComment = {
        comment: comment,
        username: username,
        created_at: "",
    };
    db.insertNewComment(imageId, comment, username)
        .then(({ rows }) => {
            newComment.created_at = rows[0].created_at;
            res.json(newComment);
        })
        .catch((err) => {
            console.error("error on db.insertNewComment: ", err);
            res.json({
                error: true,
                message: "error on inserting new comment to DB",
            });
        });
});

app.get("*", (req, res) => {
    res.redirect("/");
});

app.use((err, req, res, next) => {
    if ("File too large") {
        res.json({ error: true, message: "file to be uploaded is too large" });
    } else {
        next();
    }
});

app.listen(8080, () => console.log("Imageboard up and running on 8080"));
