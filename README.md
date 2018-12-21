# Effective.af

![Task hierarchy](https://user-images.githubusercontent.com/139603/50059966-96bdc800-0142-11e9-8f76-238f3012d877.png)

---

## What is Effective?

Effective is open source software for effectively organizing groups
and individuals to achieve a shared mission.

At its core, **Effective is end-to-end encrypted task management
software designed to facilitate mass collaboration/coordination**, and
that has a number of unique features.


### The Big Picture

The short-term goal is for Effective to enable participants to: create
a **project** with a name and mission, create a **hierarchy of tasks**
that build up to the achievement of that mission, **invite others by URL**
(without requiring invitees to hand over their email address to the
server), optionally **invite others into specific roles** (with a
title and associated task list), ask for help or clarify the assigned
tasks in **per-task chat rooms**, attach **files and documents** to
tasks, **get summoned** when relevant events occur (e.g., when you are
assigned a task, or when mentioned), receive **social recognition**
for contributions (via karma points), and **assign tasks _to other projects_**
in this ecosystem in order to harness its collective expertise and
desire to change the world.

Effective can be used for a great many things.  But we, its creators,
have certain interests.  Specifically, we are focused on organizing
activists, non-profits, and projects tackling grand challenges in
order to help solve serious problems we face as a society and fight
for a better future for all.

In addition to fighting for this more prosperous future, we aim to
confront and correct, via an energetic, global network of
forward-thinking individuals, the injustices imposed on society by
criminalized institutions the world over.

To learn more, please see https://effective.af/ or follow us
on Twitter at [@EffectiveAF](https://twitter.com/EffectiveAF/).

_See the next section to learn more about what else makes Effective unique, or look below that for how to run or contribute to the software yourself._


## Software components: Effective and LeapChat

The software that makes up Effective has 2 major features/components:
**task management** and **secure chat**.

The task management functionality can be found at
https://github.com/EffectiveAF/effective .  This `effective` repo
uses LeapChat (currently via an iframe, though this will change);
LeapChat can be found in its own GitHub repo at
https://github.com/cryptag/leapchat .

So, to be clear, we have:

1. [**Effective**](https://github.com/EffectiveAF/effective) --
(soon-to-be) end-to-end encrypted task management optimized for large
numbers of participants (especially volunteers), and

2. [**LeapChat**](https://github.com/cryptag/leapchat) -- end-to-end
encrypted chat in the browser (which we've already launched; see
[LeapChat.org](https://www.leapchat.org/)).


### The Interplay Between Chat and Task Management

Each project has many associated tasks. Each task has its own
LeapChat room attached to it for discussing the details of what should
be done, how best to achieve that task, etc.


## Unique Features

Aside from the unique aspects mentioned above, here are some features
that differentiate Effective from other task management-centric
software:


#### Task/Participant Auto-pairing and Recruitment by Skill Set

(Future feature)

When you have a non-trivial number of people participating in a
project, they're not going to know each other's skill sets, and
therefore won't know who they should assign a task that they think
_someone_ should complete, or that they personally need done as a
sub-task of whatever they are working on.

_Other task management systems do not scale_ in the ways we need them
to.

In Effective, when a new task is created and the skills necessary to
complete it are specified (by tag), participants within that task's
project who have all of the requisite skills will be notified and
asked if they'd like to be the assignee.  (Users will add their skills
to their respective profiles so that this pairing can occur.)

We'll also build in skill-based recruitment that lets users request
help from users who are on the same _server_ as the project you're
recruiting from and who have opted into creating a server-wide profile
that includes their skills and interests.


#### Assigning Tasks to Other Projects

Other systems think it terms of _teams_.  What is a team?  A small
group of closely-knit people who know each other's names, skill sets,
and so on.  But a team is also a silo cut off from the rest of the
world.

Effective does not see the world this way.  By enabling projects to
assign tasks _to other projects_, we are enabling a federation of
politically-aligned organizations/groups/projects asking each other
for help, perhaps specializing within the ecosystem, and offering
their unique talents and knowledge to other projects with whom they
partner.


#### Automatic Task Reassignment

(Future feature)

Volunteers are flaky. Someone will often volunteer for a task, or
otherwise have a task assigned to them, and not do it.

When a task's assignee hasn't made recent progress, Effective will
either ask the task's creator or reviewer if they want to ask its
assignee for a status update, or Effective could automatically,
periodically ask for said updates from assignees _without_ first
asking the reviewer if these messages should be sent out.  But the
interesting part is: an unresponsive or otherwise seemingly
not-working-on-the-task assignee can be given, say, 24 hours (or a
dynamic amount of time depending on the "velocity" of the project,
which we can measure by tracking changes in the task phases) to
respond or to make progress or _do something_, after which, if nothing
is done, **our software can automatically reassign this task** to,
say, the last person who logged in who has all of the skills required
by the task, or to the person with the most karma points with all the
requisite skills, or to the person who invited the current assignee to
the project in the first place, or some other auto-calculable
variant.

...and in writing this, I realize that the tasks's _reviewer_, not
just assignee, could be auto-reassigned in the same fashion if a task
is finished but the reviewer doesn't mark it as done for some period
of time.


#### End-to-end Encryption

(This feature partially exists for chat, not yet there for task
management)

For private projects, tasks will be encrypted, in which case the
server will not be able to see the title, description/deliverables,
etc of a task in unencrypted form, just its relation to other tasks,
the username of the assignee, and its status (e.g., "WorkingOn").

The encryption library we are currently using is
[miniLock](https://github.com/kaepora/minilock), which has undergone a
thorough security audit by the venerable Cure53.  miniLock enables us
to deterministically generate a passphrase from (1) a username and (2)
a passphrase.  From the user's perspective, they will sign into
Effective as they would sign into any other website or app (other than
us requiring a stronger password), but in this case we are generating
a keypair for that user, which JavaScript running in their browser
(and, later, their native app) uses to encrypt and decrypt content.

Each private project is associated with 3 top-level passphrases, each
of which used to generate a unique keypair using miniLock.  That
passphrase is generated in the browser/on the device of the user who
created that project.  When some other user is invited to a private
project, the invite includes a passphrase that can be used to decrypt
an encrypted copy of the top-level-key-generating passphrase (using
the same technique as
[miniShare](https://github.com/cryptag/minishare), which we also
built, and that has been launched at <https://minishare.io>),
depending upon which permissions level they were invited at.


## Tech Stack

Effective is all React on the frontend and Go + Postgres +
[PostgREST](https://tryingtobeawesome.com/postgrest/) on the backend.
(Eventually we will add TypeScript type annotations; contact
@elimisteve if you would like to help with this!)

The strategy: write React code once, begin on-boarding users into a
web app version of Effective ASAP, make a bunch of improvements based
on user feedback, add [various features](https://effectiveaf.nolt.io/),
then reuse 80% of that code to build a React Native version for Android
and iOS, and also a native desktop version using Electron.  And _then_
we'll have a 3rd party security audit done.

---

# Running Effective

## WARNING

Do not yet expose this server software to the world without at least
setting `REACT_APP_BASIC_AUTH_USERNAME` and
`REACT_APP_BASIC_AUTH_PASSWORD` in `.env`, and even then everyone who
possesses those credentials can do anything to the database; we have
yet to add proper accounts/authentication, which we're doing via a
combination of cryptographic auth and PostgREST's JWTs (JSON Web
Tokens).  Hang tight!


## Linux Quickstart

If you're trying to run Effective on an Ubuntu server that does _not_
already have Go installed, then just run this one command:

```
curl https://raw.githubusercontent.com/EffectiveAF/effective/develop/install_linux.sh | bash
```

You'll be asked to type in your `sudo` password, then to type two
other commands, but after that, Effective should be running on your
system!


## Getting Started

### Install Go

If you're on Linux or macOS _and_ if don't already have
[Go](https://golang.org/dl/) version 1.8 or newer installed
(`$ go version` will tell you), you can install Go by running:

```
curl https://raw.githubusercontent.com/elimisteve/install-go/master/install-go.sh | bash
source ~/.bashrc
```

Then grab and build the `effective` source:

```
go get github.com/EffectiveAF/effective
```

### macOS Instructions

If you don't already have Postgres 9.5 or newer installed and running,
install it with Homebrew:

```
brew install postgresql
```

Next, you'll need three terminals.

**In the first terminal**, run database migrations, download `postgrest`,
and have `postgrest` connect to Postgres:

```
cd $(go env GOPATH)/src/github.com/EffectiveAF/effective/db
createdb
sudo -u $USER bash init_sql.sh
wget https://github.com/begriffs/postgrest/releases/download/v0.4.3.0/postgrest-v0.4.3.0-osx.tar.xz
tar xvf postgrest-v0.4.3.0-osx.tar.xz
./postgrest postgrest.conf
```

**In the second terminal**, run Effective's Go backend:

```
cd $(go env GOPATH)/src/github.com/EffectiveAF/effective
go build
./effective
```

**In the third terminal**, install JavaScript dependencies and start
Effective's auto-reloading dev server:

```
cd $(go env GOPATH)/src/github.com/EffectiveAF/effective
npm install
npm run build
npm run start
```

Effective should now be running on <http://localhost:8081>!


### Linux Instructions (for Ubuntu; works on Debian if other dependencies met)

If you don't already have Node 7.x installed (`node --version` will tell
you the installed version), install Node by running:

```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs
```


If you don't already have Postgres 9.5 or newer installed and running,
install it by running:

```
sudo apt-get install postgresql postgresql-contrib
```

Next, you'll need three terminals.

**In the first terminal**, run database migrations, download `postgrest`,
and have `postgrest` connect to Postgres:

```
cd $(go env GOPATH)/src/github.com/EffectiveAF/effective/db
sudo -u postgres bash init_sql.sh
wget https://github.com/begriffs/postgrest/releases/download/v0.4.3.0/postgrest-v0.4.3.0-ubuntu.tar.xz
tar xvf postgrest-v0.4.3.0-ubuntu.tar.xz
./postgrest postgrest.conf
```

**In the second terminal**, run Effective's Go backend:

```
cd $(go env GOPATH)/src/github.com/EffectiveAF/effective
go build
./effective
```

**In the third terminal**, install JavaScript dependencies and start
Effective's auto-reloading dev server:

```
cd $(go env GOPATH)/src/github.com/EffectiveAF/effective
npm install
npm run start
```

Effective should now be running on <http://localhost:8081>!

### Production Deployment Build

Same as the Linux commands above, with two modifications.

Replace:

```
npm run start
```

with

```
# !!! Add HTTP Basic Auth credentials to .env to password-protect your Effective server! !!!
source .env
npm run build
```

Replace:

```
go build
./effective
```

with

```
go build
# !!! Add HTTP Basic Auth credentials to .env to password-protect your Effective server! !!!
source .env
sudo setcap cap_net_bind_service=+ep effective
./effective -prod -domain YOURDOMAINNAMEGOESHERE.com -http :80 -https :443
```

To enable chat functionality, run
[LeapChat](https://github.com/cryptag/leapchat) on port 8080.

To send email notifications to users, run
[EffectiveMail](https://github.com/EffectiveAF/effectivemail)
as instructed in its
[`README`](https://github.com/EffectiveAF/effectivemail#effectivemail).


## Conventions

Please follow these naming and spacing conventions when submitting a pull request:
[React + Redux Conventions](https://unbug.gitbooks.io/react-native-training/content/45_naming_convention.html).


## Code style and format

We use a combination of [Prettier](https://prettier.io/docs/en/index.html) and [Eslint](https://eslint.org/docs/user-guide/getting-started). Prettier is an opinionated code formatter but does not care about code-quality rules. It only concerns formatting rules. This is why we use Eslint for code-quality rules but not for formatting rules. Read more about the difference between linters and Prettier here: <https://prettier.io/docs/en/comparison.html>. Not ever do we want formatting rules in the `.eslintrc` configuration file. Not implicitly or explicitly. To make sure of that we have a NPM script called verify-eslint-rules (`npm run verify-eslint-rules`) that gives an error if there are Eslint rules somewhere in our `.eslintrc` configuration that conflicts with Prettier's formatting rules.

Before submitting PRs, please fix and format your code using `npm run lint`.


## NPM scripts

Besides from the script [generated by create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#available-scripts) (`npm start`, `npm test`, `npm run build` and `npm run eject`) we have several custom scripts as well:

- `lint` - Runs linting with the `--fix` flag AND formats the code with Prettier (**please run this against your code before submitting PRs**).
- `lint:check` - Just checks the code for lint errors (Eslint only).
- `format` - Automatically fixes the code to fit Prettier's format rules.
- `format:check` - Just checks the code for format errors (Prettier only).
- `ci` - The purpose of this script is to be executed in a CI platform for every pull request. It checks linting, code format and makes sure that there are not any Eslint rules that conflicts with Prettier format rule.


# Partners, Sponsors, Thank Yous

## Hypothesis

<a href="https://hypothes.is/">
  <img src="public/assets/img/HypothesisLogo.png" alt="Hypothesis logo" />
</a>

We are in the process of integrating with
[Hypothesis](https://hypothes.is/), the web annotation platform, so
that our users can coordinate crowdsourced investigative resource more
effectively.


## BrowserStack

<a href="https://www.browserstack.com/">
  <img src="https://user-images.githubusercontent.com/139603/41737979-bd4af8f0-7545-11e8-8b2e-ab2a8e6e30b8.png" alt="BrowserStack logo" />
</a>

We use BrowserStack to ensure the cross-browser compatibility of
Effective on both mobile and desktop.  Thank you BrowserStack for
sponsoring us!


## Pursuance

Effective began its life as a fork of the original
[Pursuance](https://github.com/PursuanceProject/pursuance) code base.
Both forks were started by
[@elimisteve](https://github.com/elimisteve).
