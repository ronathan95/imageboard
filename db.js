const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(
        "SELECT url, username, title, description FROM images ORDER BY created_at DESC"
    );
};
