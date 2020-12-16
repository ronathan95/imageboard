const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(
        "SELECT id, url, username, title, description FROM images ORDER BY created_at DESC"
    );
};

module.exports.insertNewImage = (url, username, title, description) => {
    const q =
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)";
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getImageInfo = (imageId) => {
    const q =
        "SELECT url, username, title, description, created_at FROM images WHERE id = ($1)";
    const params = [imageId];
    return db.query(q, params);
};
