ALTER TABLE task_lists
    ADD COLUMN pursuance_id        integer REFERENCES pursuances(id),
    ADD COLUMN parent_task_list_id integer REFERENCES task_lists(id),
    ADD COLUMN is_role             bool,
    ADD COLUMN is_milestone        bool    DEFAULT false;

UPDATE task_lists SET is_role = false,
                      is_milestone = false;

ALTER TABLE task_lists
    ALTER COLUMN pursuance_id SET NOT NULL,
    ALTER COLUMN is_role SET NOT NULL,
    ALTER COLUMN is_milestone SET NOT NULL;
