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