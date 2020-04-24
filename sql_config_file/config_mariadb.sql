CREATE TABLE IF NOT EXISTS Servers (
    server_id VARCHAR(22) PRIMARY KEY,
    server_name TEXT,
    -- Rules --
    allow_use_bot TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_use_bot = 0 OR allow_use_bot = 1),
    allow_set_bot TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_set_bot = 0 OR allow_set_bot = 1),
    allow_use_alias TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_use_alias = 0 OR allow_use_alias = 1),
    allow_create_alias TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_create_alias = 0 OR allow_create_alias = 1),
    allow_set_rainbow TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_set_rainbow = 0 OR allow_set_rainbow = 1)
    -- end rules --
);

CREATE TABLE IF NOT EXISTS Users (
    user_id VARCHAR(22) NOT NULL,
    server_id VARCHAR(22) NOT NULL,
    user_name TEXT,
    -- rules --
    is_owner TINYINT(1) NOT NULL DEFAULT 0 CHECK (is_owner = 0 OR is_owner = 1),
    rules_enable TINYINT(1) NOT NULL DEFAULT 0 CHECK (rules_enable = 0 OR rules_enable = 1),
    rules_bypass TINYINT(1) NOT NULL DEFAULT 0 CHECK (rules_bypass = 0 OR rules_bypass = 1),
    allow_use_bot TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_use_bot = 0 OR allow_use_bot = 1),
    allow_set_bot TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_set_bot = 0 OR allow_set_bot = 1),
    allow_use_alias TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_use_alias = 0 OR allow_use_alias = 1),
    allow_create_alias TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_create_alias = 0 OR allow_create_alias = 1),
    allow_set_rainbow TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_set_rainbow = 0 OR allow_set_rainbow = 1),
    -- end rules --
    PRIMARY KEY(user_id, server_id),
    FOREIGN KEY(`server_id`) REFERENCES `Servers`(`server_id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Alias (
    server_id VARCHAR(22) NOT NULL,
    alias_url TEXT NOT NULL,
    alias_name VARCHAR(255) NOT NULL,
    created_by VARCHAR(22) NOT NULL,
    timestamp TIMESTAMP,
    PRIMARY KEY(server_id, alias_name),
    FOREIGN KEY(`server_id`) REFERENCES `Servers`(`server_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY(`created_by`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Roles (
    role_id VARCHAR(22) NOT NULL,
    server_id VARCHAR(22) NOT NULL,
    role_name TEXT,
    -- rainbow --
    is_rainbow TINYINT(1) NOT NULL DEFAULT 0 CHECK (is_rainbow = 0 OR is_rainbow = 1),
    is_random TINYINT(1) NOT NULL DEFAULT 0 CHECK (is_random = 0 OR is_random = 1),
    loop_time INT(11) NOT NULL DEFAULT 30 CHECK (loop_time > 0 AND loop_time < 100),
    -- rules --
    rules_enable TINYINT(1) NOT NULL DEFAULT 0 CHECK (rules_enable = 0 OR rules_enable = 1),
    rules_bypass TINYINT(1) NOT NULL DEFAULT 0 CHECK (rules_bypass = 0 OR rules_bypass = 1),
    allow_use_bot TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_use_bot = 0 OR allow_use_bot = 1) ,
    allow_set_bot TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_set_bot = 0 OR allow_set_bot = 1),
    allow_use_alias TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_use_alias = 0 OR allow_use_alias = 1),
    allow_create_alias TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_create_alias = 0 OR allow_create_alias = 1),
    allow_set_rainbow TINYINT(1) NOT NULL DEFAULT 0 CHECK (allow_set_rainbow = 0 OR allow_set_rainbow = 1),
    -- end rules --
    PRIMARY KEY (role_id, server_id),
    FOREIGN KEY(`server_id`) REFERENCES `Servers`(`server_id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Rainbow (
  color_id INT NOT NULL AUTO_INCREMENT,
  role_id VARCHAR(22) NOT NULL,
  hex_color TEXT NOT NULL,
  PRIMARY KEY (color_id),
  FOREIGN KEY(`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS BotLog (
  log_id INT NOT NULL AUTO_INCREMENT,
  type TEXT,
  message TEXT,
  PRIMARY KEY(log_id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ServerLog (
  log_id INT NOT NULL AUTO_INCREMENT,
  server_id VARCHAR(22) NOT NULL,
  type TEXT,
  message TEXT,
  PRIMARY KEY(log_id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Keylogger (
  keylogger_id INT NOT NULL AUTO_INCREMENT,
  entry_id VARCHAR(22),
  server_id VARCHAR(22),
  server_name TEXT,
  user_id VARCHAR(22),
  user_name TEXT,
  message BLOB,
  PRIMARY KEY(keylogger_id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);