# UI State Management

## What is UI State?

A UI state represents the current condition of the user interface.

Examples:

- Loading
- Success
- Error
- Empty
- Not Found

---

## Why?

- Improves readability
- Easier maintenance
- Easier debugging
- Better user experience

---

## Good Practice

Name UI states with descriptive functions.

Example:

showLoadingState()

showEmptySearchState()

showCityNotFoundState()

---

## Revision

Think in states, not individual DOM updates.