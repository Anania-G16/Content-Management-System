# Git Workflow Standards

This document defines the Git branching strategy, commit message conventions, pull request requirements, and development workflow for the Virtual Keno Platform.

These standards apply to **all repositories** within the Virtual Keno GitHub Organization.

---

# Branching Strategy

The platform follows a Git Flow–inspired workflow.

## Permanent Branches

### `main`

* Production-ready code only.
* Protected branch.
* Direct commits are prohibited.
* Changes are merged only through approved Pull Requests.

---

### `develop`

* Main integration branch.
* All completed features are merged here first.
* Used for QA, integration testing, and release preparation.

---

# Temporary Branches

## Feature Branches

Used for implementing new functionality.

Format:

```text
feature/<service>/<short-description>
```

Examples:

```text
feature/player/player-registration
feature/player/kyc-verification
feature/wallet/create-wallet
feature/wallet/transfer-funds
feature/payment/chapa-integration
feature/payment/deposit-api
feature/betting/ticket-validation
feature/draw/generate-winning-numbers
feature/settlement/prize-calculation
```

---

## Bug Fix Branches

Used for fixing defects during development.

Format:

```text
bugfix/<service>/<short-description>
```

Examples:

```text
bugfix/wallet/negative-balance
bugfix/payment/duplicate-callback
bugfix/player/login-timeout
```

---

## Hotfix Branches

Used to resolve critical production issues.

Format:

```text
hotfix/<service>/<short-description>
```

Examples:

```text
hotfix/payment/payment-timeout
hotfix/wallet/ledger-corruption
hotfix/api/security-patch
```

Hotfixes are branched from `main` and merged back into both `main` and `develop`.

---

## Release Branches

Used to prepare production releases.

Format:

```text
release/v<major>.<minor>.<patch>
```

Examples:

```text
release/v1.0.0
release/v1.1.0
release/v2.0.0
```

Only bug fixes, documentation updates, and release activities are allowed.

---

## Experiment Branches (Optional)

Used for prototypes or research.

Format:

```text
experiment/<description>
```

Examples:

```text
experiment/new-cache
experiment/grpc-performance
```

Experimental branches must never be merged directly into `main`.

---

# Branch Naming Rules

* Use lowercase letters only.
* Separate words with hyphens (`-`).
* Do not use spaces.
* Keep names short and descriptive.
* Include the service name whenever possible.

Good examples:

```text
feature/player/update-profile
feature/wallet/freeze-funds
feature/settlement/process-payout
```

Avoid:

```text
feature/newFeature
feature/test
mybranch
feature/alazar-work
```

---

# Commit Message Convention

The platform follows the **Conventional Commits** specification.

Format:

```text
<type>(<scope>): <short description>
```

Example:

```text
feat(wallet): implement wallet creation
```

---

## Commit Types

### Feature

```text
feat(wallet): add wallet freeze operation
```

---

### Bug Fix

```text
fix(payment): prevent duplicate callback processing
```

---

### Documentation

```text
docs(readme): update deployment instructions
```

---

### Refactoring

```text
refactor(player): simplify registration workflow
```

---

### Performance

```text
perf(settlement): optimize prize calculation
```

---

### Testing

```text
test(wallet): add transfer service unit tests
```

---

### Build

```text
build(api): update Go dependencies
```

---

### Continuous Integration

```text
ci(github): add security scanning workflow
```

---

### Chore

```text
chore(config): update application configuration
```

---

### Security

```text
security(auth): rotate JWT signing keys
```

---

### Revert

```text
revert(wallet): revert balance locking implementation
```

---

# Commit Message Rules

A commit should:

* Represent a single logical change.
* Be written in the imperative mood.
* Be concise.
* Clearly describe the intent.

Good examples:

```text
feat(player): add player registration endpoint

fix(wallet): prevent negative balances

docs(api): document settlement endpoints

refactor(payment): extract payment validation

test(draw): increase draw coverage
```

Avoid:

```text
fixed stuff

changes

update

final

work

bug fix

misc
```

---

# Pull Request Rules

Every Pull Request shall:

* Target the correct branch.
* Pass all CI checks.
* Include a clear description.
* Reference related issues or tasks.
* Be reviewed by at least one maintainer.
* Resolve merge conflicts before approval.

A Pull Request should contain a single logical change.

---

# Merge Strategy

Use **Squash and Merge** for feature branches.

Benefits:

* Cleaner Git history.
* Easier release management.
* Simpler rollback.
* Improved traceability.

Avoid merge commits unless preserving branch history is required.

---

# Versioning

The platform follows **Semantic Versioning (SemVer)**.

Format:

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

Version increment rules:

* **MAJOR** – Breaking API changes.
* **MINOR** – Backward-compatible features.
* **PATCH** – Backward-compatible bug fixes.

---

# Development Workflow

```text
Create Issue
      │
      ▼
Create Feature Branch
      │
      ▼
Implement Feature
      │
      ▼
Commit Using Conventional Commits
      │
      ▼
Push Branch
      │
      ▼
Open Pull Request
      │
      ▼
Code Review
      │
      ▼
CI/CD Validation
      │
      ▼
Squash and Merge into develop
      │
      ▼
Release Branch
      │
      ▼
Production (main)
```

---

# Branch Protection Rules

The `main` branch shall enforce:

* No direct pushes.
* Pull Requests required.
* At least one approval.
* Passing CI/CD checks.
* Resolved conversations before merge.
* No force pushes.
* No branch deletion.

The `develop` branch shall enforce:

* Pull Requests required.
* Passing CI/CD checks.
* No force pushes.

---

# Best Practices

* Keep branches short-lived.
* Commit frequently with meaningful messages.
* Rebase regularly to reduce merge conflicts.
* Avoid mixing unrelated changes in a single commit.
* Delete merged branches after completion.
* Never commit secrets, credentials, or generated artifacts.
* Keep commit history clean and descriptive.

---

# Example Workflow

```text
git checkout develop

git pull origin develop

git checkout -b feature/wallet/create-wallet

# Implement changes

git add .

git commit -m "feat(wallet): implement wallet creation"

git push origin feature/wallet/create-wallet

# Open Pull Request → develop
```

---

Following these standards ensures a consistent Git history, predictable release process, and efficient collaboration across all Virtual Keno platform repositories.

