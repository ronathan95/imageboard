const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.error("error on db.getImages: ", err);
        });
});

app.listen(8080, () => console.log("Imageboard up and running on 8080"));
