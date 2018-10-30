ALTER TABLE task_lists ADD COLUMN gid text NOT NULL UNIQUE;


CREATE OR REPLACE FUNCTION set_task_list_gid() RETURNS trigger AS $$
DECLARE
    correct_gid text := NEW.pursuance_id::text || '_' || NEW.id::text;
BEGIN
    IF NEW.gid IS DISTINCT FROM correct_gid THEN
        NEW.gid := correct_gid;
    end IF;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
ALTER FUNCTION set_task_list_gid() OWNER TO superuser;

CREATE TRIGGER trigger_set_task_list_gid
    BEFORE INSERT OR UPDATE ON task_lists
    FOR EACH ROW
    EXECUTE PROCEDURE set_task_list_gid();

CREATE INDEX task_lists_gid_idx ON task_lists (gid);
ALTER INDEX task_lists_gid_idx OWNER TO superuser;
