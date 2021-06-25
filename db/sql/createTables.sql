CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    url_id VARCHAR(20) NOT NULL UNIQUE,
    destination_url VARCHAR NOT NULL,
    clicks_count INT DEFAULT 0
);