# Learning Journal

## Day 1

Theme:
Repository Foundation

Learned:
- Git basics
- Local vs GitHub
- Commits are snapshots
- Meaningful commit messages
- Folder structure

Commit:
chore: initialize repository and establish project foundation

---

## Day 2

Theme:
DOM Caching

Learned:
- Cache frequently used DOM elements
- DOM lookup vs cached references
- Maintainability over micro-performance
- Prettier trailing commas
- Code review before commit

Commit:
refactor: cache frequently accessed DOM elements



## Day 3

**Theme:** Avoid Magic Strings

- Learned why hardcoded strings reduce code readability.
- Replaced repeated values with named constants.
- Used `UPPER_SNAKE_CASE` for configuration constants.
- Applied constants for API status codes, forecast time, and localStorage keys.
- Performed a code review and fixed remaining inconsistencies.
- **Commit:** `refactor: replace magic strings with named constants`

## Day 4

**Theme:** Single Responsibility Principle

- Learned why small functions are easier to understand and maintain.
- Extracted search history logic from `handleSearch()`.
- Reduced the responsibilities of a large function.
- **Commit:** `refactor: extract search history logic into dedicated function`

## Day 5

**Theme:** Configuration & API Security

- Learned the difference between configuration and security.
- Understood why frontend API keys cannot be truly hidden.
- Documented current limitations in the README.
- Added a roadmap for future engineering improvements.
- **Commit:** `docs: improve project documentation and security notes`


## Day 6

**Theme:** DRY Principle

- Learned to avoid repeating UI update logic.
- Extracted reusable functions for loading and city-not-found states.
- Improved readability by replacing repeated statements with descriptive function calls.
- **Commit:** `refactor: extract reusable weather UI state functions`


## Day 7

**Theme:** Error Handling

- Learned defensive programming principles.
- Improved consistency in error handling.
- Added developer-friendly error logging.
- Centralized repeated error UI where appropriate.
- **Commit:** `refactor: improve error handling and debugging`


## Day 8

**Theme:** UI State Management

- Learned to think in terms of application states instead of individual DOM updates.
- Extracted the empty search UI into its own state function.
- Improved readability by giving another UI state a descriptive name.
- **Commit:** `refactor: extract empty search UI state and DOM caching`


## Day 9

**Theme:** Project Organization

- Organized the project into logical sections using comments.
- Improved readability by grouping related functionality together.
- Cached the forecast container for consistency.
- Learned the difference between helper functions and business logic.
- **Commit:** `refactor: organize project structure and improve readability`


## Day 10

**Theme:** Smart Search History

- Redesigned search history to prioritize recent searches.
- Prevented duplicate entries by moving existing cities to the top.
- Limited search history to five items for a cleaner user experience.
- Refactored the logic into a reusable `saveSearchHistory(cityName)` function.
- Practiced `findIndex()`, `splice()`, `unshift()`, and `pop()` together.
- **Commit:** `feat: improve recent search history behavior`