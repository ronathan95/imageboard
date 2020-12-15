const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(
        "SELECT url, username, title, description FROM images ORDER BY created_at DESC"
    );
};

module.exports.insertNewImage = (url, username, title, description) => {
    const q =
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)";
    const params = [url, username, title, description];
    return db.query(q, params);
};
