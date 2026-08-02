# Environment Variables

## What are they?

Configuration values stored outside source code.

Examples:

- API keys
- Database URLs
- Secret tokens

---

## Why use them?

- Avoid hardcoding configuration
- Easier deployment
- Different configs for development and production

---

## Important

Frontend `.env` files are NOT secret.

The browser still receives the values.

True secrecy requires a backend server.

---

## Revision

`.env` improves configuration management.

Backend protects secrets.