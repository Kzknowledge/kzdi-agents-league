# Contributing to KZDI Talent OS

Thank you for your interest in contributing to KZDI Talent OS! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome contributors from all backgrounds
- Focus on technical merit and collaboration
- Report violations to maintainers

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Git
- GitHub account

### Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR-USERNAME/kzdi-talent-os.git
cd kzdi-talent-os
git remote add upstream https://github.com/Kzknowledge/kzdi-talent-os.git
```

### Setup Development Environment

```bash
npm install
cp .env.example .env
# Edit .env with test credentials
npm run dev
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/descriptive-name
# or for bug fixes:
git checkout -b fix/issue-description
```

### 2. Make Changes

Follow these standards:

#### Code Style
- Use **ES6+ syntax** (async/await, arrow functions, destructuring)
- Use **camelCase** for variables and functions
- Use **UPPER_SNAKE_CASE** for constants
- Use **PascalCase** for classes
- Maximum line length: 100 characters

#### Comments
```javascript
/**
 * Clear description of what this function does
 * @param {Type} param - What this parameter does
 * @returns {Type} What this returns
 */
function doSomething(param) {
  // Use inline comments for complex logic
  return result;
}
```

#### Error Handling
```javascript
// ✅ Good: Specific error handling
try {
  await apiCall();
} catch (error) {
  console.error(`[PREFIX] Specific error: ${error.message}`);
  throw error; // or handle gracefully
}

// ❌ Avoid: Silent failures
try {
  await apiCall();
} catch (error) {
  // ignore
}
```

#### Logging Format
```javascript
// Use consistent format with emoji prefixes
console.log('[✅ FOUNDRY] Connection established');
console.warn('[⚠️  SUPABASE] Connection failed');
console.error('[❌ TELEGRAM] Invalid token');
```

### 3. Test Your Changes

```bash
# Run tests
npm test

# Dry run (no API calls)
DRY_RUN=true npm start

# Debug mode
DEBUG=true npm start

# Lint check (placeholder for now)
npm run lint
```

### 4. Commit Changes

Follow conventional commit format:

```bash
git add .
git commit -m "feat: add candidate filtering by skill"
git commit -m "fix: handle missing Telegram token gracefully"
git commit -m "docs: update API reference"
git commit -m "refactor: extract validation logic"
git commit -m "test: add evaluation parser tests"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Build, dependencies, etc.

### 5. Push & Create PR

```bash
git push origin feature/your-feature
# Create Pull Request on GitHub
```

## Pull Request Process

### PR Requirements
1. **Clear title**: `feat: add X functionality`
2. **Detailed description**:
   - What problem does this solve?
   - How was it tested?
   - Any breaking changes?
3. **Link to issues**: `Closes #123`
4. **Screenshots** (if UI changes)
5. **No merge conflicts**

### PR Template

```markdown
## Description
Brief explanation of changes.

## Related Issues
Closes #123

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Breaking change

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] All tests pass

## Checklist
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Error handling added
- [ ] Logging added where appropriate
```

### Reviewer Feedback

- Respond constructively to feedback
- Make requested changes and push updates
- Re-request review when ready
- Maintainers will merge when approved

## Areas to Contribute

### 1. Core Features
- Enhanced evaluation logic
- New talent track definitions
- Alternative LLM providers (Gemini, Groq, etc.)

### 2. Integration
- CRM/ATS platform connectors
- Additional notification channels
- Data export formats

### 3. Documentation
- Tutorial expansion
- API docs
- Deployment guides
- Example scripts

### 4. Infrastructure
- Docker support
- CI/CD improvements
- Database migrations
- Observability enhancements

### 5. Testing
- Unit test coverage
- Integration tests
- Mock API responses
- Load testing

## Bug Reports

### Reporting Issues

1. Check [existing issues](https://github.com/Kzknowledge/kzdi-talent-os/issues)
2. Use bug report template
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Node.js version
   - Environment (Windows/Mac/Linux)
   - Error logs

### Bug Report Template

```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Do this
2. Then this
3. Then this

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node: 18.x
- OS: Ubuntu 22.04
- npm: 9.x

## Error Logs
```
<paste error here>
```
```

## Feature Requests

1. Check [discussions](https://github.com/Kzknowledge/kzdi-talent-os/discussions)
2. Describe the feature clearly
3. Explain use case and benefits
4. Suggest implementation approach

## Documentation

### Update Docs When:
- Adding new features
- Changing API signatures
- Modifying environment variables
- Fixing bugs that affect usage

### Documentation Standards
- Clear, concise language
- Code examples for new features
- Update table of contents
- Link to related sections
- Include Nigerian examples where appropriate

## Security & Secrets

### ❌ Never Commit:
- `.env` files
- API keys or tokens
- Private credentials
- Database passwords
- Authentication secrets

### ✅ Instead:
- Document in `.env.example`
- Use environment variable names
- Reference secret management best practices
- Use GitHub Secrets for CI/CD

## Merge Conflicts

If your PR has merge conflicts:

```bash
git fetch upstream
git rebase upstream/main
# Resolve conflicts in your editor
git add .
git rebase --continue
git push --force-with-lease origin feature/your-feature
```

## Code Review Checklist

Before submitting PR, verify:

- [ ] Code follows style guide
- [ ] All tests pass (`npm test`)
- [ ] No console errors/warnings
- [ ] No secrets in code
- [ ] Environment variables documented
- [ ] Error handling in place
- [ ] Comments explain complex logic
- [ ] Commit messages follow convention
- [ ] PR description is clear
- [ ] No unnecessary dependencies added

## Project Maintainers

- **Kz (Umar Muhammad Sani)** - [@Kzknowledge](https://github.com/Kzknowledge)

### Maintainer Responsibilities
- Review pull requests
- Guide contributors
- Maintain code quality
- Release updates
- Monitor issues

## Release Process

1. Version bump in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Tag release: `git tag v1.0.0`
5. Push with tags: `git push --tags`
6. Create GitHub release

**Versioning**: Semantic Versioning (MAJOR.MINOR.PATCH)

## Questions?

- 💬 Start a [discussion](https://github.com/Kzknowledge/kzdi-talent-os/discussions)
- 📧 Email: info@kzdi.ai
- 🐛 Report [issues](https://github.com/Kzknowledge/kzdi-talent-os/issues)

---

Thank you for contributing to KZDI Talent OS! 🙏

**Made with ❤️ for the Arewa tech community**

