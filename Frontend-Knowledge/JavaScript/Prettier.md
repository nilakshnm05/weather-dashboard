# Prettier

## What is Prettier?

An opinionated code formatter.

It automatically formats code into a consistent style.

---

## Why use it?

✔ Consistent formatting

✔ No style debates

✔ Cleaner Git history

✔ Better readability

---

## What did we notice?

Prettier automatically added:

```javascript
document.getElementById(
    "week-details-container",
);
```

The comma is called a **trailing comma**.

---

## Trailing Comma

Allowed in:

- Arrays
- Objects
- Function parameters
- Function calls

Example:

```javascript
foo(
    "hello",
);
```

Valid JavaScript.

---

## Why use trailing commas?

Cleaner Git diffs.

Before:

```javascript
foo(
    a,
    b
)
```

After adding a parameter:

```javascript
foo(
    a,
    b,
    c,
)
```

Only one new line changes.

---

## Rule

Don't fight Prettier.

Let the formatter handle style.

Focus on:

- Logic
- Architecture
- Naming
- Debugging

---

## Common Settings

```json
{
  "trailingComma": "all"
}
```

---

## Revision (30 sec)

Prettier formats code.

Trailing commas improve Git diffs.

Formatting should be automated.