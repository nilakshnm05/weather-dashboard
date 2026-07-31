# Magic Strings

## What are Magic Strings?

Hardcoded string values that appear directly in code without explanation.

Example:

```javascript
if (data.cod === "404")
```

Better:

```javascript
const CITY_NOT_FOUND = "404";

if (data.cod === CITY_NOT_FOUND)
```

---

## Why avoid them?

- Improves readability
- Easier maintenance
- Reduces duplication
- Centralizes important values

---

## Good Candidates

- API status codes
- LocalStorage keys
- Theme names
- Fixed filter values
- Configuration values

---

## Don't overdo it

Not every string needs to become a constant.

User-facing messages can remain inline until a centralized messaging system is needed.

---

## Interview Question

What is a magic string and why should it be avoided?

---

## Revision (30 sec)

Give repeated, meaningful strings descriptive names.

