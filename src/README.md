# KZDI Talent OS

> **AI-powered candidate evaluation system for Arewa youth development**
>
> Leveraging Azure Foundry IQ to assess technical talent across machine learning, NLP, data infrastructure, and full-stack development tracks.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Production](https://img.shields.io/badge/Status-Production-brightgreen)](https://github.com/Kzknowledge/kzdi-talent-os)

---

## 🎯 Overview

**KZDI Talent OS** is a production-grade AI evaluation engine that:

1. **Assesses candidates** across 4 talent tracks (ML Engineering, NLP, Data Infrastructure, Full Stack)
2. **Provides confidence scores** (0.0–1.0) with detailed reasoning steps
3. **Persists results** to Supabase for analytics and reporting
4. **Sends notifications** via Telegram for real-time visibility
5. **Maintains observability** through structured logging and audit trails

Perfect for hackathon submissions, talent pipeline development, and research into AI-driven career matching.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm 9+
- **Azure Foundry IQ** API key (from Azure Portal)
- **Supabase project** (optional, for data persistence)
- **Telegram bot** (optional, for notifications)

### 1. Clone & Setup

```bash
git clone https://github.com/Kzknowledge/kzdi-talent-os.git
cd kzdi-talent-os

npm install
cp .env.example .env
```

### 2. Configure `.env`

```bash
# Required: Azure Foundry IQ
FOUNDRY_IQ_KEY=sk-your-api-key-here
FOUNDRY_IQ_ENDPOINT=https://your-resource.services.ai.azure.com/api/projects/...

# Optional: Data Persistence
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-public-anon-key

# Optional: Notifications
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_ADMIN_CHAT_ID=your-chat-id
```

### 3. Run Demo

```bash
npm start
```

**Expected output:**
```
🚀 KZDI TALENT OS — Candidate Evaluation Engine
[📋 SETUP] Verifying environment...
[🔌 INIT] Initializing clients...
[👥 EVAL] Starting candidate evaluations...

✅ Connected to Foundry IQ
✅ 3 candidates evaluated
✅ Results stored in Supabase
✅ Telegram notifications sent
```

---

## 📊 How It Works

### Evaluation Pipeline

```
┌─────────────┐
│  Candidate  │
│   Profile   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Azure Foundry IQ API       │
│  - Structured prompt        │
│  - 4 talent tracks          │
│  - Confidence scoring       │
│  - 4 reasoning steps/track  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Evaluation Result          │
│  - Track scores (0.0-1.0)   │
│  - Top recommendation       │
│  - Full reasoning           │
└──────┬──────────────────────┘
       │
    ┌──┴──┬──────┬─────────┐
    ▼     ▼      ▼         ▼
 Display Store Telegram  Audit
```

### Sample Output

```
======================================================================
TALENT EVALUATION: Chioma Okafor
======================================================================

1. NLP SPECIALIZATION
   Confidence: 92.0% ████████████████████
   Reasoning:
     1. Deep familiarity with Transformers library and PyTorch
     2. Active participation in hausa_nlp_track community
     3. Stated learning goal aligns with Hausa language NLP
     4. Intermediate experience level appropriate for specialization

2. MACHINE LEARNING ENGINEERING
   Confidence: 85.0% ██████████████████
   ...

TOP TRACK: nlp_specialization
RECOMMENDATION: Pursue NLP specialization given Hausa language focus
======================================================================
```

---

## 📁 Project Structure

```
kzdi-talent-os/
├── src/
│   ├── demo.js                    # Main entry point
│   ├── foundry-integration.js     # Azure Foundry API client
│   ├── supabase-client.js         # Data persistence layer
│   └── telegram-notify.js         # Notification system
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies & metadata
├── README.md                      # This file
├── CONTRIBUTING.md                # Contributing guidelines
├── LICENSE                        # MIT License
└── SECURITY.md                    # Security policy
```

---

## 🔧 API Reference

### `foundry-integration.js`

```javascript
import { evaluateCandidate, formatEvaluation } from './src/foundry-integration.js';

// Evaluate a single candidate
const result = await evaluateCandidate({
  name: 'Chioma Okafor',
  skills: ['Python', 'PyTorch', 'Transformers'],
  experience: 'intermediate',
  languages: ['English', 'Igbo'],
  community: 'hausa_nlp_track',
  goal: 'Work with Hausa language data'
});

// Format for display
console.log(formatEvaluation(result));
```

### `supabase-client.js`

```javascript
import { initSupabase, storeEvaluation, getLeaderboard } from './src/supabase-client.js';

// Initialize
initSupabase();

// Store evaluation
await storeEvaluation(result);

// Get leaderboard for a track
const topCandidates = await getLeaderboard('nlp_specialization', 10);
```

### `telegram-notify.js`

```javascript
import { notifyEvaluation, notifyBatchComplete } from './src/telegram-notify.js';

// Notify on evaluation
await notifyEvaluation(result);

// Batch summary
await notifyBatchComplete([result1, result2, result3]);
```

---

## 📦 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FOUNDRY_IQ_KEY` | ✅ Yes | Azure Foundry API key |
| `FOUNDRY_IQ_ENDPOINT` | ✅ Yes | Foundry agent endpoint URL |
| `SUPABASE_URL` | ❌ No | Supabase project URL |
| `SUPABASE_KEY` | ❌ No | Supabase public anon key |
| `TELEGRAM_BOT_TOKEN` | ❌ No | Telegram bot token |
| `TELEGRAM_ADMIN_CHAT_ID` | ❌ No | Telegram chat ID |
| `ENABLE_TELEGRAM_NOTIFICATIONS` | ❌ No | Feature flag (default: true) |
| `DRY_RUN` | ❌ No | Test mode without API calls |
| `DEBUG` | ❌ No | Verbose logging |

---

## 🧪 Testing

### Test Telegram Connection

```bash
node src/scripts/test-telegram.js
```

### Dry Run (No API Calls)

```bash
DRY_RUN=true npm start
```

### Debug Mode

```bash
DEBUG=true npm start
```

---

## 🏗️ Deployment

### Local Development

```bash
npm install
npm run dev  # Watch mode
```

### Production

```bash
npm run build
npm start
```

### Environment Management

```bash
# Development
export NODE_ENV=development
export FOUNDRY_IQ_KEY=your-dev-key

# Production
export NODE_ENV=production
export FOUNDRY_IQ_KEY=your-prod-key
npm start
```

---

## 📊 Data Model

### Candidates Table (Supabase)

```sql
CREATE TABLE candidates (
  id BIGINT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  skills TEXT[],
  experience_level VARCHAR(50),
  languages TEXT[],
  community VARCHAR(100),
  learning_goal TEXT,
  updated_at TIMESTAMP
);
```

### Evaluations Table

```sql
CREATE TABLE evaluations (
  id BIGINT PRIMARY KEY,
  candidate_id BIGINT REFERENCES candidates(id),
  ml_engineering_confidence FLOAT,
  nlp_specialization_confidence FLOAT,
  data_infrastructure_confidence FLOAT,
  full_stack_confidence FLOAT,
  top_track VARCHAR(100),
  recommendation TEXT,
  full_evaluation JSONB,
  created_at TIMESTAMP
);
```

---

## 🔒 Security

### Best Practices

1. **Never commit `.env`** — it's in `.gitignore`
2. **Use service keys** for Supabase in production (not anon keys)
3. **Rotate API keys** regularly
4. **Enable RLS** on Supabase tables
5. **Audit all operations** via `audit_log` table

### Credentials Storage

- **Local**: Use `.env` files (git-ignored)
- **GitHub**: Use Secrets (Settings → Secrets and variables → Actions)
- **Production**: Use Azure Key Vault or similar

See [SECURITY.md](SECURITY.md) for detailed guidelines.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code standards
- Pull request process
- Testing requirements
- Commit conventions

### Quick Contribution Steps

```bash
git checkout -b feature/your-feature
# Make changes
npm test
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open Pull Request
```

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙋 Support

### Issues

Found a bug? [Open an issue](https://github.com/Kzknowledge/kzdi-talent-os/issues)

### Questions

Questions or feature requests? Start a [discussion](https://github.com/Kzknowledge/kzdi-talent-os/discussions)

### Documentation

- 📖 [API Documentation](#-api-reference)
- 🔧 [Setup Guide](#-quick-start)
- 🛡️ [Security Policy](SECURITY.md)

---

## 🎓 Background

**KZDI Technologies Ltd** is building AI infrastructure for emerging markets, with a focus on:
- Arewa youth development
- Hausa language NLP
- Distributed systems for cost-constrained environments
- Production-grade open-source tooling

**Talent OS** is part of our larger initiative to democratize access to AI-driven talent assessment.

---

## 🚀 Roadmap

- [ ] Multi-language interview generation
- [ ] Real-time candidate dashboard
- [ ] Integration with job platforms (LinkedIn, GitHub)
- [ ] Community-driven track definitions
- [ ] Mobile app for candidate onboarding
- [ ] Self-hosted deployment guides

---

## 📞 Contact

**KZDI Technologies Ltd**  
Northern Nigeria 🇳🇬

- Website: [kzdi.ai](https://kzdi.ai)
- GitHub: [@Kzknowledge](https://github.com/Kzknowledge)
- LinkedIn: [KZDI Technologies](https://linkedin.com/company/kzdi-technologies)

---

**Made with ❤️ for the Arewa tech community**

```
███╗   ██╗███████╗██╗      █████╗  ██████╗ 
████╗  ██║██╔════╝██║     ██╔══██╗██╔════╝ 
██╔██╗ ██║█████╗  ██║     ███████║██║  ███╗
██║╚██╗██║██╔══╝  ██║     ██╔══██║██║   ██║
██║ ╚████║███████╗███████╗██║  ██║╚██████╔╝
╚═╝  ╚═══╝╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ 
```

