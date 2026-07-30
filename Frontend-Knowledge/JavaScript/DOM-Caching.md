# DOM Caching

## What is DOM Caching?

Store DOM elements inside variables instead of repeatedly searching them.

Example:

```javascript
const tempElement = document.getElementById("today-temp");
```

---

## Why?

✔ Cleaner code

✔ Easier maintenance

✔ Reuse DOM references

✔ Fewer repeated DOM lookups

---

## Before

```javascript
document.getElementById("aqi").textContent = "...";
document.getElementById("aqi").style.color = "red";
```

---

## After

```javascript
const aqiElement = document.getElementById("aqi");

aqiElement.textContent = "...";
aqiElement.style.color = "red";
```

---

## Real Project Usage

Cache elements used multiple times.

Examples:

- Buttons
- Inputs
- Cards
- Containers
- Icons

---

## Common Mistakes

❌ Caching elements before they exist

❌ Creating duplicate variables

❌ Caching elements used only once

---

## Our Refactor

Cached:

- locationElement
- tempElement
- condElement
- aqiElement
- iconElement
- forecastHeading
- weekDetailsContainer
- searchElement

---

## Interview Question

Why cache DOM elements?

Answer:

Mainly for maintainability and readability.
Performance improvement is usually a secondary benefit.

---

## Revision (30 sec)

Cache once.

Reuse everywhere.

Write cleaner code.