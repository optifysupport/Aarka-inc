# Project Memory & Operational Rules

## Security and Secrets Protection
- Absolutely no hardcoding or exposing of secrets, database credentials, API tokens, or keys in any source code, tests, docs, or GitHub Actions YAML files.
- All secrets must be injected through environment variables (`.env`) locally or GitHub Secrets (`${{ secrets.SECRET_NAME }}`) in CI/CD pipelines.
- Verify `.gitignore` rules before staging files to ensure no sensitive files are tracked.

## Documentation Rules
- No emojis in README or documentation files.
- Provide objective, precise documentation.

## Commit Guidelines
- Use clear, descriptive, professional git commit messages.
