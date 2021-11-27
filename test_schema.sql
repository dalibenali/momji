-- schema of test database
CREATE DATABASE IF NOT EXISTS test;

CREATE TABLE teams(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    description VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
)ENGINE = InnoDB;

CREATE TABLE employees(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    address VARCHAR(200) NOT NULL, 
    registered DATETIME NOT NULL,
    isActive BOOLEAN NOT NULL,
    team_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT `fk_employee_team` 
    	FOREIGN KEY (team_id) REFERENCES teams (id) 
    	ON DELETE CASCADE
)ENGINE = InnoDB;

-- teams SEEDS
    -- INSERT INTO teams (name, description, created_at, updated_at) VALUES ('toto' ,'desc lux', '2019-03-10 02:55:05', '2019-06-10 00:55:05');
    -- INSERT INTO teams (name, description, created_at, updated_at) VALUES ('titi' ,'desc lux', '2019-03-10 02:55:05', '2019-06-10 00:55:05');
    -- INSERT INTO teams (name, description, created_at, updated_at) VALUES ('tata' ,'desc lux', '2019-03-10 02:55:05', '2019-06-10 00:55:05');


-- employees SEEDS
    -- INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (
    -- 'jim' ,
    -- 'walker', 
    -- 'jimwalker@yahoo.com', 
    -- '3909 Witmer Rd, Niagara Falls, NY 14305, États-Unis', 
    -- '2018-04-17 04:59:45', 
    -- false, 35, 
    -- '2019-03-10 02:55:05', 
    -- '2019-06-10 00:55:05');

    -- INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (
    -- 'Ali' ,
    -- 'boucer', 
    -- 'boucer@yahoo.com', 
    -- '1200 Witmer Rd, Niagara Falls, NY 14305, États-Unis', 
    -- '2018-04-17 04:59:45', 
    -- false, 35, 
    -- '2019-03-10 02:55:05', 
    -- '2019-06-10 00:55:05');

    -- INSERT INTO employees (firstName, lastName, email, address, registered, isActive, team_id, created_at, updated_at) VALUES (
    -- 'Alex' ,
    -- 'legrand', 
    -- 'legrand@yahoo.com', 
    -- '2300 Witmer Rd, Niagara Falls, NY 14305, États-Unis', 
    -- '2018-04-17 04:59:45', 
    -- false, 34, 
    -- '2019-03-10 02:55:05', 
    -- '2019-06-10 00:55:05');