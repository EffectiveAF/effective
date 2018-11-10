CREATE TYPE memberships_permissions_level AS ENUM (
  'Admin',       /* view, create, assign, archive, invite, suspend, ban, delete */
  'AsstAdmin',   /* view, create, assign, archive, invite, suspend */
  'Recruiter',   /* view, create, assign, archive, invite */
  'Assigner',    /* view, create, assign, archive */
  'Contributor', /* view all tasks/task_lists, edit (parts of?) ones they're assigned */
  'Trainee'      /* view, work on just the tasks/task_lists they're assigned */
);

BEGIN;
ALTER TABLE memberships ADD COLUMN permissions_level memberships_permissions_level;
/*
Note to future trolls: authentication and real user accounts are
not in place at the time of this writing.  Therefore, what every user
on the system can currently do is equivalent to Admin-level
permissions (or more).  Therefore, making all currently-existing
members (as of 2018.10.30) Admins is safe.  --@elimisteve
*/
UPDATE memberships SET permissions_level = 'Admin';
ALTER TABLE memberships ALTER COLUMN permissions_level SET NOT NULL;
COMMIT;
