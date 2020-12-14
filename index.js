const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

// const cities = [
//     {
//         name: "Berlin",
//         country: "Germany",
//     },
//     {
//         name: "Taipei",
//         country: "Taiwan",
//     },
//     {
//         name: "Reykjavik",
//         country: "Iceland",
//     },
// ];

// app.get("/cities", (req, res) => {
//     // then i want to send the cities back as a JSON response.
//     // we don't use RENDER for this project!
//     res.json(cities);
// });

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
