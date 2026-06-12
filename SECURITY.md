# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please **report it responsibly** rather than using the public issue tracker.

### How to Report

1. **Email**: security@kzdi.ai (monitored daily)
2. **Do not** open a public issue
3. **Do not** disclose the vulnerability publicly before we've fixed it
4. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- Initial response: Within 24 hours
- Patch release: Within 7 days (for critical issues)
- Public disclosure: After patch is released

---

## Security Best Practices

### 1. Environment Variables

#### ❌ Don't:
```javascript
// NEVER hardcode credentials
const API_KEY = 'sk-abc123xyz';
const DB_PASSWORD = 'MyP@ssw0rd';

// NEVER log sensitive data
console.log(`Token: ${apiToken}`);
```

#### ✅ Do:
```javascript
// Use environment variables
const apiKey = process.env.FOUNDRY_IQ_KEY;
if (!apiKey) {
  throw new Error('FOUNDRY_IQ_KEY not configured');
}

// Log safely
console.log(`[✅ API] Connected to Foundry`); // No secrets
```

### 2. Secret Management

#### GitHub Secrets (CI/CD)

```yaml
# .github/workflows/deploy.yml
- name: Deploy
  env:
    FOUNDRY_IQ_KEY: ${{ secrets.FOUNDRY_IQ_KEY }}
    SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
  run: npm start
```

#### Local Development

```bash
# .env file (git-ignored)
FOUNDRY_IQ_KEY=sk-your-secret-key
SUPABASE_KEY=your-secret-key

# Never commit .env
git status | grep .env  # Should not appear
```

#### Production Deployment

Use managed secret services:
- **Azure Key Vault** (recommended for Azure Foundry users)
- **AWS Secrets Manager**
- **HashiCorp Vault**

### 3. API Key Rotation

#### Recommended Schedule
- **Development**: Monthly
- **Production**: Quarterly or immediately if compromised

#### How to Rotate

```bash
# 1. Generate new key in Azure/Supabase/Telegram
# 2. Update GitHub Secrets
# 3. Update production environment
# 4. Verify all services work
# 5. Delete old key
# 6. Monitor logs for errors
```

### 4. Database Security

#### Supabase Configuration

```sql
-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create read-only policy
CREATE POLICY "Enable read for authenticated users"
  ON candidates
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Restrict writes
CREATE POLICY "Enable insert for app service only"
  ON evaluations
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

#### Service Keys vs Anon Keys

| Use Case | Key Type | Where |
|----------|----------|-------|
| Public read-only | Anon key | Browser, public apps |
| Internal operations | Service key | Server-side only |
| Admin tasks | Service key | Secure backend |

**Rule**: Never expose service keys to frontend.

### 5. Input Validation

#### Validate User Input

```javascript
// ✅ Good: Validate before using
function evaluateCandidate(candidate) {
  if (!candidate.name || typeof candidate.name !== 'string') {
    throw new Error('Invalid candidate name');
  }
  
  if (!Array.isArray(candidate.skills)) {
    throw new Error('Skills must be an array');
  }
  
  // Only allow specific values
  const validExperience = ['beginner', 'intermediate', 'advanced'];
  if (!validExperience.includes(candidate.experience)) {
    throw new Error('Invalid experience level');
  }
}

// ❌ Avoid: Trusting user input
function badEvaluate(candidate) {
  // Don't do this - no validation
  return database.query(`SELECT * FROM evaluations WHERE name = ${candidate.name}`);
}
```

### 6. API Security

#### HTTPS Only

```javascript
// ✅ Verify HTTPS
if (process.env.NODE_ENV === 'production') {
  if (!process.env.API_ENDPOINT.startsWith('https://')) {
    throw new Error('Production API must use HTTPS');
  }
}

// ✅ Verify certificates
const https = require('https');
const fs = require('fs');

const agent = new https.Agent({
  rejectUnauthorized: true, // Always verify SSL
  ca: fs.readFileSync('ca-bundle.crt')
});
```

#### Rate Limiting

```javascript
// Example: Limit API calls
const rateLimit = {};

function checkRateLimit(userId) {
  const now = Date.now();
  if (!rateLimit[userId]) {
    rateLimit[userId] = [];
  }
  
  // Keep only last hour
  rateLimit[userId] = rateLimit[userId].filter(time => now - time < 3600000);
  
  if (rateLimit[userId].length >= 100) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimit[userId].push(now);
}
```

### 7. Dependency Security

#### Check for Vulnerabilities

```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Check specific package
npm audit --package @supabase/supabase-js

# Generate security report
npm audit --json > security-report.json
```

#### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update to latest versions
npm update

# Upgrade major versions (carefully)
npm install package@latest
```

### 8. Error Handling

#### Don't Leak Information

```javascript
// ❌ Bad: Exposes internal details
catch (error) {
  res.status(500).send(error.stack); // Shows source code!
}

// ✅ Good: Safe error message
catch (error) {
  console.error(`[❌ API] ${error.message}`); // Log internally
  res.status(500).send('Internal server error'); // Generic to user
}
```

### 9. Logging & Monitoring

#### Log Securely

```javascript
// ✅ Good: Safe logging
const sanitize = (str) => str.replace(/sk-\w{20,}/g, 'sk-***');

try {
  await apiCall(apiKey);
  console.log('[✅ API] Request successful');
} catch (error) {
  console.error(`[❌ API] ${sanitize(error.message)}`);
}
```

#### What to Monitor

- Failed authentication attempts
- Unusual API call patterns
- Database access errors
- Service outages
- Configuration changes

### 10. Secure Defaults

#### Environment Setup

```bash
# Development
NODE_ENV=development
DEBUG=false  # Never true in production
DRY_RUN=false
LOG_LEVEL=debug

# Production
NODE_ENV=production
DEBUG=false
DRY_RUN=false
LOG_LEVEL=info
```

---

## Compliance & Standards

### Azure Foundry IQ
- ✅ Data encrypted in transit (TLS 1.2+)
- ✅ Azure AD integration available
- ✅ Audit logging built-in

### Supabase
- ✅ Row Level Security (RLS)
- ✅ Encrypted at rest (AES-256)
- ✅ HIPAA, SOC 2 Type II compliant

### General
- ✅ Follow OWASP Top 10
- ✅ Implement principle of least privilege
- ✅ Use encryption for sensitive data
- ✅ Maintain audit logs

---

## Incident Response

### If a Secret is Compromised

1. **Immediately revoke** the old key
2. **Generate new key**
3. **Update** all services within 15 minutes
4. **Monitor logs** for unauthorized use
5. **Document** what happened and why
6. **Review** access controls to prevent recurrence

### Example Response Plan

```bash
# 1. Revoke compromised token
# (In Azure Portal / Supabase Dashboard)

# 2. Generate new token
# (Save securely, don't share via email)

# 3. Update GitHub Secrets
# Settings → Secrets and variables → Actions

# 4. Update production
# Deploy with new credentials

# 5. Verify
curl -H "Authorization: Bearer $NEW_KEY" https://api.example.com/health

# 6. Clean up
# Securely delete old token from everywhere
```

---

## Developer Checklist

Before committing code:

- [ ] No hardcoded secrets or credentials
- [ ] Environment variables properly configured
- [ ] Input validation on all user input
- [ ] Error handling with safe messages
- [ ] Logging doesn't expose sensitive data
- [ ] Dependencies are up-to-date
- [ ] No `console.log` of secrets
- [ ] HTTPS used for all external APIs
- [ ] Rate limiting implemented if needed
- [ ] Database RLS policies in place
- [ ] Audit logging configured

---

## Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Azure Security Center](https://learn.microsoft.com/en-us/azure/security-center/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [npm Security Documentation](https://docs.npmjs.com/cli/v9/commands/npm-audit)

---

## Contact

**Security Issues**: security@kzdi.ai  
**General Questions**: info@kzdi.ai

---

**Last Updated**: June 2026  
**Next Review**: September 2026

