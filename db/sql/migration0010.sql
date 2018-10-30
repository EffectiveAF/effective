ALTER TABLE memberships ADD COLUMN id text;

UPDATE memberships SET id = user_username || '_' || pursuance_id::text;

ALTER TABLE memberships ALTER COLUMN id SET NOT NULL;
ALTER TABLE memberships ADD UNIQUE (id);


/* Define trigger to set memberships.id to `${user_username}_${pursuance_id}` */
CREATE OR REPLACE FUNCTION set_membership_id() RETURNS trigger AS $$
DECLARE
    correct_id text := NEW.user_username || '_' || NEW.pursuance_id::text;
BEGIN
    IF NEW.id IS DISTINCT FROM correct_id THEN
        NEW.id := correct_id;
    end IF;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;
ALTER FUNCTION set_membership_id() OWNER TO superuser;

CREATE TRIGGER trigger_set_membership_id
    BEFORE INSERT OR UPDATE ON memberships
    FOR EACH ROW
    EXECUTE PROCEDURE set_membership_id();

CREATE INDEX memberships_id_idx ON memberships (id);
ALTER INDEX memberships_id_idx OWNER TO superuser;
