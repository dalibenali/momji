-- schema of production database
CREATE DATABASE IF NOT EXISTS momji;

CREATE TABLE teams(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    description VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
)ENGINE = InnoDB;

-- SEEDS 
-- INSERT INTO teams (name, description, created_at, updated_at) VALUES ('toto' ,'desc lux', '2019-03-10 02:55:05', '2019-06-10 00:55:05');
-- INSERT INTO teams (name, description, created_at, updated_at) VALUES ('titi' ,'desc lux', '2019-03-10 02:55:05', '2019-06-10 00:55:05');
-- INSERT INTO teams (name, description, created_at, updated_at) VALUES ('tata' ,'desc lux', '2019-03-10 02:55:05', '2019-06-10 00:55:05');
