# Git Basics

## What is Git?

Git is a Distributed Version Control System (DVCS).

It tracks changes in files by creating snapshots (commits) over time.

Git != GitHub

- Git → Local version control software
- GitHub → Cloud platform to host Git repositories

---

## Basic Workflow

Working Directory
        ↓
git add
        ↓
Staging Area
        ↓
git commit
        ↓
Local Repository
        ↓
git push
        ↓
GitHub Repository

---

## Commands Learned

### Initialize Repository

```bash
git init
```

Creates a hidden `.git` folder.

---

### Check Status

```bash
git status
```

Shows:
- Modified files
- Staged files
- Untracked files

---

### Stage Files

```bash
git add .
```

Moves all changes to the staging area.

---

### Commit

```bash
git commit -m "message"
```

Creates a permanent snapshot.

---

### View Commit History

```bash
git log
```

```bash
git log --oneline
```

---

### Connect Remote

```bash
git remote add origin <repo-url>
```

---

### Push

```bash
git push -u origin main
```

Future pushes:

```bash
git push
```

---

## Commit Types

feat:      New feature

fix:       Bug fix

refactor:  Internal code improvement

docs:      Documentation

style:     Formatting

test:      Tests

chore:     Project maintenance

---

## Mental Model

Git = Save points in a game.

Every commit is a checkpoint you can always return to.

---

## Interview Question

Difference between Git and GitHub?

---

## Revision (30 sec)

Git tracks code.

Commits are snapshots.

Stage → Commit → Push.