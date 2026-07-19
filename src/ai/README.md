# KZDI Talent OS — AI Module

> Enterprise AI Gateway for KZDI Talent OS
>
> Version: **3.0**
>
> Status: **Production Ready**

---

# Overview

The AI module provides a provider-agnostic abstraction layer for integrating Large Language Models (LLMs) into the KZDI Talent OS platform.

It isolates AI provider implementations from business logic, ensuring maintainability, observability, security, and future extensibility.

Current provider:

- Google Gemini 2.5 Pro

Planned providers:

- OpenAI
- Anthropic Claude
- Azure AI Foundry
- Mock Provider (Testing)

 Design Goals

The AI module is designed around the following principles:

- Provider independence
- Deterministic prompt engineering
- Enterprise observability
- Strong runtime validation
- Type safety
- Structured telemetry
- Secure configuration
- Testability
- Scalability

 Architecture

                    EvaluationService
                            │
                            ▼
                    AI Gateway
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
     Gemini            OpenAI            Anthropic
      Provider         Provider            Provider
         │
         ▼
    Gemini Client
         │
         ▼
 Google Gemini API
         │
         ▼
 Response Validator
         │
         ▼
 Canonical Evaluation
         │
         ▼
 Telemetry
         │
         ▼
 Supabase / Logger


 Directory Structure


src/ai/

gateway/

providers/
    gemini/
    openai/
    anthropic/
    mock/

prompts/

schemas/

validator/

telemetry/

provider.ts

config.ts

README.md

 Module Responsibilities

 gateway/

Coordinates AI provider selection.

Responsibilities:

- Select configured provider
- Route requests
- Failover (future)
- Health monitoring

 providers/

Contains provider-specific implementations.

Each provider must implement:

AIProvider

Responsibilities:

- Build request
- Call provider API
- Return raw response

Providers must NOT:

- Parse JSON
- Store database records
- Apply business rules

 prompts/

Contains immutable prompt templates.

Includes:

- System prompt
- Candidate evaluation prompt

Prompt builders must be deterministic.

 schemas/

Defines canonical AI response contracts.

Uses:

- Zod
- Runtime validation
- Type inference

 validator/

Responsible for:

- JSON extraction
- Markdown removal
- Schema validation
- Business rule validation
- Response normalization

No provider should manually parse AI responses.

 telemetry/

Collects:

- Provider
- Model
- Latency
- Retries
- Success
- Errors
- Trace IDs
- Request IDs
- Token usage

Designed for future integration with:

- Supabase
- OpenTelemetry
- Azure Monitor
- Datadog
- Prometheus

 AI Request Lifecycle

Candidate

↓

EvaluationService

↓

Gateway

↓

Provider

↓

Gemini API

↓

Validator

↓

Schema Validation

↓

Business Rules

↓

Telemetry

↓

Evaluation Result


 Provider Interface

Every provider implements:

```ts
interface AIProvider {

    provider: string;

    model: string;

    evaluateCandidate();

    healthCheck();

}


 Prompt Strategy

Prompt engineering is divided into two layers.

 System Prompt

Defines immutable AI behaviour.

Responsible for:

- Safety
- JSON output
- Confidence rules
- Recommendation policy

 User Prompt

Generated dynamically.

Contains:

- Candidate profile
- Skills
- Languages
- Experience
- Goals

No provider-specific formatting is included.

 Validation Pipeline

```
Raw AI Response

↓

Extract JSON

↓

Parse JSON

↓

Zod Schema

↓

Business Rules

↓

Normalize

↓

Evaluation Object
```

Every AI response passes through this pipeline.

 Telemetry

Each AI request records:

| Metric | Description |
|----------|-------------|
| Provider | AI provider |
| Model | Model name |
| Latency | Response time |
| Success | Boolean |
| Retries | Retry count |
| Prompt Version | Prompt revision |
| Request ID | Unique request |
| Trace ID | Distributed trace |
| Tokens | Usage metrics |

---

 Error Handling

Errors are categorized as:

- Validation Errors
- Provider Errors
- Network Errors
- Timeout Errors
- Authentication Errors
- Rate Limit Errors

Providers should throw typed exceptions.

 Security

The AI module never stores:

- API Keys
- Secrets
- Credentials

Configuration is loaded exclusively from environment variables.

Prompt injection protection is enforced by:

- Immutable system prompts
- Runtime validation
- Strict JSON contracts

 Supported Models

Current:

```
gemini-2.5-pro
```

Future:

```
gpt-5

claude-opus

azure-foundry

local-llm
```

Switching providers requires changing:

```
AI_PROVIDER
```

No application code changes should be necessary.

 Testing Strategy

Recommended tests:

- Prompt builders
- Schema validation
- Provider mocking
- Gateway routing
- Retry logic
- Telemetry
- Health checks

Coverage target:

```
>90%
```

---

 Performance Targets

| Metric | Target |
|---------|--------|
| AI Latency | < 5 seconds |
| Validation | < 5 ms |
| Gateway Overhead | < 10 ms |
| Retry Attempts | 3 |
| Timeout | 30 seconds |

---

 Extending the AI Module

To add a new provider:

1. Create a provider folder.

```
providers/new-provider/
```

2. Implement:

```
AIProvider
```

3. Export the provider.

4. Register in the Gateway.

5. Update environment configuration.

No other changes should be required.

 Coding Standards

Providers should:

- Remain under ~200 lines where practical
- Avoid database access
- Avoid business logic
- Avoid direct logging outside telemetry
- Use dependency injection
- Return canonical evaluation objects


 Future Roadmap

Planned enhancements include:

- Multi-provider routing
- AI fallback chain
- Provider load balancing
- Prompt version registry
- Cost optimization
- Token budgeting
- Streaming responses
- Prompt A/B testing
- AI evaluation caching
- Semantic memory integration

 AI Module Philosophy

The AI module is intentionally isolated from the rest of the application.

Business services should not know:

- Which provider is active
- How prompts are constructed
- How responses are parsed
- How retries are performed
- How telemetry is collected

They only interact with the AI Gateway through a stable, provider-agnostic interface.

This separation enables KZDI Talent OS to evolve its AI capabilities without requiring changes to application logic, ensuring long-term maintainability, portability, and operational resilience.
