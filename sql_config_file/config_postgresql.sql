CREATE TABLE IF NOT EXISTS "Servers" (
    "server_id" TEXT PRIMARY KEY,
    "server_name" TEXT,
    -- Rules
    "allow_use_bot" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_use_bot" = 0 OR "allow_use_bot" = 1) ,
    "allow_set_bot" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_set_bot" = 0 OR "allow_set_bot" = 1),
    "allow_use_alias" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_use_alias" = 0 OR "allow_use_alias" = 1),
    "allow_create_alias" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_create_alias" = 0 OR "allow_create_alias" = 1),
    "allow_set_rainbow" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_set_rainbow" = 0 OR "allow_set_rainbow" = 1),
    -- end rules --
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Users" (
    "user_unique_id" SERIAL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "user_name" TEXT,
    -- rules --
    "is_owner" INTEGER NOT NULL DEFAULT 0 CHECK ("is_owner" = 0 OR "is_owner" = 1),
    "rules_enable" INTEGER NOT NULL DEFAULT 0 CHECK ("rules_enable" = 0 OR "rules_enable" = 1),
    "rules_bypass" INTEGER NOT NULL DEFAULT 0 CHECK ("rules_bypass" = 0 OR "rules_bypass" = 1),
    "allow_use_bot" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_use_bot" = 0 OR "allow_use_bot" = 1) ,
    "allow_set_bot" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_set_bot" = 0 OR "allow_set_bot" = 1),
    "allow_use_alias" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_use_alias" = 0 OR "allow_use_alias" = 1),
    "allow_create_alias" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_create_alias" = 0 OR "allow_create_alias" = 1),
    "allow_set_rainbow" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_set_rainbow" = 0 OR "allow_set_rainbow" = 1),
    -- end rules --
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("server_id") 
       REFERENCES "Servers"("server_id")
         ON DELETE CASCADE 
         ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Alias" (
    "alias_id" SERIAL PRIMARY KEY,
    "server_id" TEXT NOT NULL,
    "alias_url" TEXT NOT NULL,
    "alias_name" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("server_id") 
       REFERENCES "Servers"("server_id")
         ON DELETE CASCADE 
         ON UPDATE NO ACTION,
    FOREIGN KEY("created_by") 
       REFERENCES "Users"("user_unique_id")
         ON DELETE CASCADE 
         ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "Roles" (
    "role_unique_id" SERIAL PRIMARY KEY,
    "role_id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "role_name" TEXT,
    "is_rainbow" INTEGER NOT NULL DEFAULT 0 CHECK ("is_rainbow" = 0 OR "is_rainbow" = 1),
    "is_random" INTEGER NOT NULL DEFAULT 0 CHECK ("is_random" = 0 OR "is_random" = 1),
    "loop_time" INTEGER NOT NULL DEFAULT 30 CHECK ("loop_time" > 0 AND "loop_time" < 100),
    -- rules --
    "rules_enable" INTEGER NOT NULL DEFAULT 0 CHECK ("rules_enable" = 0 OR "rules_enable" = 1),
    "rules_bypass" INTEGER NOT NULL DEFAULT 0 CHECK ("rules_bypass" = 0 OR "rules_bypass" = 1),
    "allow_use_bot" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_use_bot" = 0 OR "allow_use_bot" = 1) ,
    "allow_set_bot" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_set_bot" = 0 OR "allow_set_bot" = 1),
    "allow_use_alias" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_use_alias" = 0 OR "allow_use_alias" = 1),
    "allow_create_alias" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_create_alias" = 0 OR "allow_create_alias" = 1),
    "allow_set_rainbow" INTEGER NOT NULL DEFAULT 0 CHECK ("allow_set_rainbow" = 0 OR "allow_set_rainbow" = 1),
    -- end rules --
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("server_id") 
       REFERENCES "Servers"("server_id")
         ON DELETE CASCADE 
         ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS "Rainbow" (
  "color_id" SERIAL PRIMARY KEY,
  "role_id" INTEGER NOT NULL,
  "hex_color" TEXT NOT NULL,
    FOREIGN KEY("role_id") 
       REFERENCES "Roles"("role_unique_id")
         ON DELETE CASCADE 
         ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS "BotLog" (
  "log_id" SERIAL PRIMARY KEY,
  "type" TEXT,
  "message" TEXT,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ServerLog" (
  "log_id" SERIAL PRIMARY KEY,
  "server_id" TEXT NOT NULL,
  "type" TEXT,
  "message" TEXT,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Keylogger" (
  "entry_unique_id" SERIAL PRIMARY KEY,
  "entry_id" TEXT,
  "server_id" TEXT,
  "server_name" TEXT,
  "user_id" TEXT,
  "user_name" TEXT,
  "message" BYTEA,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);