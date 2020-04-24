CREATE TABLE IF NOT EXISTS Servers (
    server_id TEXT PRIMARY KEY,
    server_name TEXT,
    -- Rules --
    allow_use_bot INT NOT NULL DEFAULT 0 CHECK (allow_use_bot = 0 OR allow_use_bot = 1),
    allow_set_bot INT NOT NULL DEFAULT 0 CHECK (allow_set_bot = 0 OR allow_set_bot = 1),
    allow_use_alias INT NOT NULL DEFAULT 0 CHECK (allow_use_alias = 0 OR allow_use_alias = 1),
    allow_create_alias INT NOT NULL DEFAULT 0 CHECK (allow_create_alias = 0 OR allow_create_alias = 1),
    allow_set_rainbow INT NOT NULL DEFAULT 0 CHECK (allow_set_rainbow = 0 OR allow_set_rainbow = 1)
    -- end rules --
);

CREATE TABLE IF NOT EXISTS Users (
    user_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    user_name TEXT,
    -- rules --
    is_owner INT NOT NULL DEFAULT 0 CHECK (is_owner = 0 OR is_owner = 1),
    rules_enable INT NOT NULL DEFAULT 0 CHECK (rules_enable = 0 OR rules_enable = 1),
    rules_bypass INT NOT NULL DEFAULT 0 CHECK (rules_bypass = 0 OR rules_bypass = 1),
    allow_use_bot INT NOT NULL DEFAULT 0 CHECK (allow_use_bot = 0 OR allow_use_bot = 1),
    allow_set_bot INT NOT NULL DEFAULT 0 CHECK (allow_set_bot = 0 OR allow_set_bot = 1),
    allow_use_alias INT NOT NULL DEFAULT 0 CHECK (allow_use_alias = 0 OR allow_use_alias = 1),
    allow_create_alias INT NOT NULL DEFAULT 0 CHECK (allow_create_alias = 0 OR allow_create_alias = 1),
    allow_set_rainbow INT NOT NULL DEFAULT 0 CHECK (allow_set_rainbow = 0 OR allow_set_rainbow = 1),
    -- end rules --
    PRIMARY KEY(user_id, server_id),
    FOREIGN KEY(server_id) REFERENCES Servers(server_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Alias (
    server_id TEXT NOT NULL,
    alias_url TEXT NOT NULL,
    alias_name TEXT NOT NULL,
    created_by TEXT NOT NULL,
    PRIMARY KEY(server_id, alias_name),
    FOREIGN KEY(server_id) REFERENCES Servers(server_id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY(created_by) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Roles (
    role_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    role_name TEXT,
    -- rainbow --
    is_rainbow INT NOT NULL DEFAULT 0 CHECK (is_rainbow = 0 OR is_rainbow = 1),
    is_random INT NOT NULL DEFAULT 0 CHECK (is_random = 0 OR is_random = 1),
    loop_time INT(11) NOT NULL DEFAULT 30 CHECK (loop_time > 0 AND loop_time < 100),
    -- rules --
    rules_enable INT NOT NULL DEFAULT 0 CHECK (rules_enable = 0 OR rules_enable = 1),
    rules_bypass INT NOT NULL DEFAULT 0 CHECK (rules_bypass = 0 OR rules_bypass = 1),
    allow_use_bot INT NOT NULL DEFAULT 0 CHECK (allow_use_bot = 0 OR allow_use_bot = 1) ,
    allow_set_bot INT NOT NULL DEFAULT 0 CHECK (allow_set_bot = 0 OR allow_set_bot = 1),
    allow_use_alias INT NOT NULL DEFAULT 0 CHECK (allow_use_alias = 0 OR allow_use_alias = 1),
    allow_create_alias INT NOT NULL DEFAULT 0 CHECK (allow_create_alias = 0 OR allow_create_alias = 1),
    allow_set_rainbow INT NOT NULL DEFAULT 0 CHECK (allow_set_rainbow = 0 OR allow_set_rainbow = 1),
    -- end rules --
    PRIMARY KEY (role_id, server_id),
    FOREIGN KEY(server_id) REFERENCES Servers(server_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS Rainbow (
  color_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id TEXT NOT NULL,
  hex_color TEXT NOT NULL,
  FOREIGN KEY(role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS BotLog (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ServerLog (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id TEXT NOT NULL,
  type TEXT,
  message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Keylogger (
  keylogger_id INTEGER PRIMARY KEY AUTOINCREMENT,
  entry_id TEXT,
  server_id TEXT,
  server_name TEXT,
  user_id TEXT,
  user_name TEXT,
  message BLOB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);