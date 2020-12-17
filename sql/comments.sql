DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_id INTEGER NOT NULL REFERENCES images(id)
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'love that hair!',
    'hounddog',
    2
);