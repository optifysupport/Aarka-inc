# Project Guidelines & Memory

## Security and Secrets Management
- Never commit or expose API keys, database credentials, authentication secrets, tokens, or private environment values in the repository or public workflows.
- Store sensitive values exclusively in local environment files (`.env`) or GitHub Repository Secrets.
- Maintain `.env` exclusions in `.gitignore` to prevent unintended credential leaks.
- In GitHub Actions workflows, always reference credentials through secret variables (e.g. `${{ secrets.SUPABASE_URL }}`).

## Documentation Standards
- Do not use emojis in README or technical documentation files.
- Keep documentation clear, concise, and structured.

## Version Control
- Write standard, professional git commit messages.
