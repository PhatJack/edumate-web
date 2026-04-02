# Commit Message Guidelines

This project uses **Conventional Commits** with commitlint.

## Format

```

<type>(<scope>): <subject>

```

- `type`: **required**
- `scope`: optional
- `subject`: **required**, short description (≤150 chars)

## Types

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation
- `style`: formatting only
- `refactor`: code change (no fix/feature)
- `test`: tests
- `chore`: tooling, deps
- `perf`: performance
- `ci`: CI/CD
- `build`: build system
- `revert`: revert commit

## Subject Rules

- lowercase only
- no trailing `.`
- use imperative (e.g. `add`, `fix`)
- not empty
- concise but clear
- max 120 characters per commit message

## Example

✅ `feat(auth): add google oauth`

❌ `Feat(auth): Add Google OAuth.`

## Scope (optional)

Examples: `auth`, `api`, `ui`, `dashboard`, `deps`, `config`

## Breaking Change

Use `!`:

```

feat(api)!: change auth endpoint

```

## Note

Commit messages are validated by commitlint — invalid messages will be rejected.
