BEGIN;
ALTER TABLE users DROP CONSTRAINT proper_username;
ALTER TABLE users ADD CONSTRAINT proper_username2 CHECK (username ~ '^[a-z][a-z0-9\-]{0,44}[a-z0-9]$');
COMMIT;
