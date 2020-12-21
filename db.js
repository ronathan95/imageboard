const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(
        "SELECT id, url, title FROM images ORDER BY created_at DESC LIMIT 6"
    );
};

module.exports.insertNewImage = (url, username, title, description) => {
    const q =
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id";
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getImageInfo = (imageId) => {
    const q =
        "SELECT url, username, title, description, created_at FROM images WHERE id = ($1)";
    const params = [imageId];
    return db.query(q, params);
};

module.exports.getMoreImages = (lastImageId) => {
    const q =
        "SELECT id, url, title, " +
        "(SELECT id " +
        "FROM images " +
        "ORDER BY id ASC " +
        "LIMIT 1 " +
        ') AS "lowestId" FROM images ' +
        "WHERE id < $1 " +
        "ORDER BY id DESC " +
        "LIMIT 6;";
    const params = [lastImageId];
    return db.query(q, params);
};

module.exports.getComments = (imageId) => {
    const q =
        "SELECT comment, username, created_at FROM comments WHERE image_id = ($1)";
    const params = [imageId];
    return db.query(q, params);
};

module.exports.insertNewComment = (imageId, comment, username) => {
    const q =
        "INSERT INTO comments (image_id, comment, username) VALUES ($1, $2, $3) RETURNING created_at";
    const params = [imageId, comment, username];
    return db.query(q, params);
};

deleteImageFromComments = (imageId) => {
    const q = "DELETE FROM comments WHERE image_id = ($1)";
    const params = [imageId];
    return db.query(q, params);
};

deleteImageFromImages = (imageId) => {
    const q = "DELETE FROM images WHERE id = ($1)";
    const params = [imageId];
    return db.query(q, params);
};

module.exports.deleteImage = (imageId) => {
    deleteImageFromComments(imageId)
        .then(() => {
            deleteImageFromImages(imageId)
                .then(() => {
                    console.log(`image with id ${imageId} was deleted`);
                    return;
                })
                .catch((err) => {
                    console.error("error on deleteImageFromImages: ", err);
                });
        })
        .catch((err) => {
            console.error("error on deleteImageFromComments: ", err);
        });
};
