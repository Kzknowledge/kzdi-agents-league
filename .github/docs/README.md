# KZDI Agents League — Talent OS Enterprise

> Enterprise AI Talent Intelligence Infrastructure powered by Autonomous Agents, AI Gateway Architecture, and Secure Cloud-Native Systems.

![Project Status](https://img.shields.io/badge/status-production--architecture-green)
![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Pro-blue)
![Database](https://img.shields.io/badge/database-Supabase%20PostgreSQL-green)
![Security](https://img.shields.io/badge/security-RLS%20Hardened-success)
![Architecture](https://img.shields.io/badge/architecture-Agentic%20AI-purple)

# Overview

KZDI Agents League is the implementation repository for the **KZDI Talent OS**, an enterprise-grade Artificial Intelligence talent intelligence platform.

The system is designed to demonstrate how autonomous AI agents, secure data infrastructure, and intelligent evaluation systems can work together to discover, analyze, and develop human potential.

This repository represents the production engineering foundation behind KZDI Talent OS.

It includes:

- AI Agent infrastructure
- AI Gateway abstraction layer
- Candidate evaluation workflows
- Supabase intelligence database
- Secure data access architecture
- Automation pipelines
- Observability systems
- Enterprise documentation

# Vision

To create a trusted Digital Intelligence infrastructure where Artificial Intelligence helps institutions discover, develop, and deploy human capability at scale.

# Mission

KZDI Talent OS transforms raw talent data into actionable intelligence through:

- Artificial Intelligence
- Agentic workflows
- Data intelligence
- Secure automation
- Explainable recommendations

# Core Principle

> Knowledge is not power. Applied knowledge is power.

The platform focuses on converting intelligence into measurable outcomes.


# System Purpose

Traditional systems answer:

> "Who applied?"

Talent OS answers:

> "Who has potential, why, and what should happen next?"

The platform provides intelligent decision support for:

- Talent programs
- Educational institutions
- Workforce initiatives
- Recruiters
- Innovation ecosystems
- Government digital transformation programs

# Repository Scope

This repository contains the implementation of KZDI Talent OS within the Agents League environment.

It is responsible for:KZDI Agents League Repository
│

    ▼
Talent OS Intelligence Layer
│

    ├── AI Gateway

    ├── Agent Orchestration

    ├── Candidate Evaluation

    ├── Secure Database Layer

    ├── Observability

    └── Deployment Infrastructure

# Key Capabilities

## AI Intelligence Layer

- Multi-provider AI architecture
- Gemini integration
- AI Gateway abstraction
- Prompt management
- Structured evaluation output
- AI response validation
- Retry and failure handling


## Talent Intelligence Engine

Capabilities include:

- Candidate profiling
- Skill analysis
- Evaluation scoring
- Track recommendation
- Learning pathway generation
- Talent intelligence analytics


## Secure Data Platform

Built on Supabase PostgreSQL:

- Row Level Security
- Secure functions
- Database auditing
- Vector intelligence support
- Event telemetry
- Controlled data exposure


## Autonomous Agent Foundation

The platform supports:

- Agent workflows
- AI decision pipelines
- Evaluation automation
- Operational notifications
- Future multi-agent collaboration



# Enterprise Security Status

Security hardening has been completed across the Talent OS database layer.

Completed security improvements include:

| Area | Status |
|---|---|
| Function search path hardening | ✅ Complete |
| SECURITY DEFINER protection | ✅ Complete |
| GraphQL exposure reduction | ✅ Complete |
| RLS enforcement | ✅ Complete |
| Audit protection | ✅ Complete |

The system now follows defense-in-depth principles:User
↓
Authentication
↓
Authorization
↓
RLS Policies
↓
Secure Functions
↓
Database
↓
Audit Layer

Security remediation included 18+ fixes across database permissions, function security, and access control. 2


# Technology Stack

## Artificial Intelligence

- Gemini AI
- AI Gateway Architecture
- Agent workflows
- Structured AI responses


## Backend

- TypeScript
- Node.js
- Enterprise service architecture


## Database

- Supabase PostgreSQL
- Row Level Security
- pgvector
- pgcrypto
- pg_graphql
- Database functions


## Automation

- Make.com
- Telegram notifications
- Event-driven workflows


## Infrastructure

- GitHub
- GitHub Actions
- Vercel
- Supabase

# Repository Structure/kzdi-agents-league/
├── docs/
├── src/
│   ├── ai/
│   │   ├── gateway/
│   │   ├── providers/
│   │   ├── prompts/
│   │   ├── schemas/
│   │   ├── telemetry/
│   │   └── validator/
│   │
│   ├── core/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   ├── database/
│   ├── telemetry/
│   ├── types/
│   └── utils/
├── supabase/
├── deployment/
├── tests/
├── .github/
├── README.md
└── package.json

# Documentation Index

| Document | Purpose |
|-|-|
| ARCHITECTURE.md | Complete system design |
| AI_GATEWAY.md | AI infrastructure specification |
| DATABASE.md | Database architecture |
| SECURITY.md | Security model |
| DEPLOYMENT.md | Deployment procedures |
| OBSERVABILITY.md | Monitoring architecture |
| ROADMAP.md | Product evolution |
| CHANGELOG.md | Release history |


# Current Development Phase

 Enterprise Modernization v3.0

Current objectives:

✅ AI Gateway migration  
✅ Gemini provider integration  
✅ Production security hardening  
✅ Enterprise documentation  
✅ Observability foundation  
✅ Deployment readiness

Project Status:Architecture       ✅ Ready Security           ✅ Hardened AI Gateway         🚧 Active Development Documentation         🚧 Final Preparation

# Built By
@Kriptomech
Mechanical Coker: Dev | lead 
**Kimiyyar Zahiri Digital Intelligence (KZDI)**

Building practical Digital Intelligence systems for Africa and emerging markets.

                         Applications
                              |
                              |
                              ▼

                    ┌──────────────────┐
                    │   KZDI AI Gateway │
                    └────────┬─────────┘
                             |
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼

┌──────────────┐    ┌────────────────┐    ┌───────────────┐
│ Agent Router │    │ Context Engine │    │ Tool Runtime  │
│              │    │                │    │               │
│ Agent Select │    │ Memory         │    │ APIs          │
│ Task Routing │    │ Knowledge      │    │ Functions     │
│ Workflow     │    │ Retrieval      │    │ Automation    │
└──────┬───────┘    └───────┬────────┘    └──────┬────────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            |
                            ▼

              ┌────────────────────────┐
              │ Model Provider Adapter │
              └───────────┬────────────┘
                          |
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼

      OpenAI          Claude          Gemini

          │               │               │

          └───────────────┴───────────────┘

                    AI Reasoning Layer
                    
                    
                    
                    Gateway Components
1. Agent Router
The Agent Router determines which specialized agent should handle an incoming request.
Responsibilities:
Analyze user intent
Select appropriate agent
Manage agent workflows
Control execution paths
Example: User Request

      ↓

AI Gateway

      ↓

Agent Router

      ↓

┌───────────────────────┐
│ Talent Agent          │
│ Evaluation Agent      │
│ Knowledge Agent       │
│ Automation Agent      │
└───────────────────────┘

2. Context Engine
The Context Engine provides agents with relevant information required for reasoning.
Sources include:
User data
Application state
Previous interactions
Knowledge repositories
Vector search results
Agent memory
Flow:Request

 +

Relevant Context

 +

Agent Instructions

 +

Retrieved Knowledge


          ↓


AI Reasoning Process

3. Tool Runtime
Agents require controlled access to external capabilities.
The Tool Runtime manages:
API execution
Database operations
External integrations
Automation workflows
Internal platform functions
All tool execution follows:
authentication
authorization
logging
monitoring
Example:Agent

  |

  ├── Database Tool
  |
  ├── Search Tool
  |
  ├── API Tool
  |
  └── Workflow Tool

  4. Model Provider Abstraction
KZDI Agents League does not depend on a single AI model provider.
The Model Provider Adapter provides a common interface for multiple intelligence providers.
Supported providers:
OpenAI-compatible models
Anthropic Claude
Google Gemini
Local / open-source models
Future AI providers through adapters
Architecture: Application

      ↓

KZDI AI Gateway

      ↓

Provider Adapter

      ↓

Selected AI Model

Benefits:
Provider flexibility
Reduced vendor lock-in
Easier model upgrades
Cost optimization
Experimental model support

5. Prompt & Agent Configuration Management
The gateway manages:
System instructions
Agent behaviors
Prompt versions
Model parameters
Execution policies
Example:Agent Definition

      +

System Prompt

      +

Available Tools

      +

Memory Context

      +

Model Configuration


          ↓


Agent Execution

6. Security & Governance Layer
Every AI request passes through governance controls.
Controls include:
Authentication checks
Permission validation
Rate limiting
Input validation
Output monitoring
Execution auditing
Security principle:
AI agents should be powerful, but every action must remain observable and controlled.

7. Observability Integration
The AI Gateway produces operational intelligence signals.
Tracked events:
Agent executions
Model requests
Tool usage
Latency metrics
Errors
Cost signals
Workflow outcomes
Example: Agent Request

      ↓

AI Gateway

      ↓

Execution Trace

      ↓

Observability System

      ↓

Monitoring Dashboard

AI Gateway Design Principles
Modular Intelligence
Agents, tools, and models remain independent components.
Provider Independence
The platform can adopt new AI models without major architectural changes.
Secure Execution
Agents operate through controlled permissions instead of unrestricted access.
Observable Intelligence
Every important AI action generates traceable system events.
Scalable Agent Ecosystem
New agents can be added through registration rather than rebuilding the platform.
Future Expansion
The AI Gateway architecture supports future capabilities:
Multi-agent collaboration
Autonomous workflows
Agent marketplace
Knowledge graph reasoning
Human-in-the-loop approvals
AI performance evaluation
Self-improving agent systems.

Section Status: Production Architecture Draft
Repository: Kzknowledge/kzdi-agents-league
Architecture Role: Core Intelligence Orchestration Layer.
Development Requirements
Before starting development, ensure the following tools are available:
Tool
Purpose
Git
Source control and repository management
Node.js 20+
Application runtime
npm / pnpm
Package management
Supabase CLI
Database and backend development
Modern Browser
Application testing
Code Editor
Development environment
Clone Repository
Clone the official repository:
git clone https://github.com/Kzknowledge/kzdi-agents-league.git
Navigate into the project:
cd kzdi-agents-league
Install Dependencies
Install project dependencies:
npm install
or using pnpm:
pnpm install
Verify installation:
npm run
Available project commands will be displayed.
Project Structure
The repository follows a modular architecture:kzdi-agents-league/

├── app/
│   ├── frontend application
│   └── user interfaces

├── components/
│   └── reusable UI components

├── agents/
│   ├── agent definitions
│   ├── workflows
│   └── execution logic

├── gateway/
│   ├── AI Gateway services
│   ├── routing logic
│   └── provider adapters

├── lib/
│   └── shared utilities

├── database/
│   ├── migrations
│   └── schemas

├── functions/
│   └── backend functions

├── docs/
│   └── architecture documentation

└── package.json

Local Development Environment
Start Development Server
Run:
npm run dev
The application will start locally:
http://localhost:3000
Development Workflow
The recommended workflow:
Create Feature

      ↓

Local Development

      ↓

Testing

      ↓

Commit Changes

      ↓

Pull Request

      ↓

Code Review

      ↓

Production Deployment
Branch Strategy
Development follows a structured Git workflow:
main
 |
 |
 ├── feature/*
 |
 ├── fix/*
 |
 └── docs/*
Branch examples:
git checkout -b feature/new-agent
git checkout -b fix/gateway-error
git checkout -b docs/update-readme
Code Quality Standards
Every contribution should maintain:
Clean Architecture
Modular components
Separation of concerns
Reusable services
Clear interfaces
Type Safety
Where applicable:
Strong typing
Interface definitions
Validation schemas
Security First
Developers must:
Avoid committing secrets
Validate external inputs
Use environment variables
Follow least-privilege principles
Database Development
Local database development uses Supabase tooling.
Initialize Supabase:
supabase init
Start local services:
supabase start
Apply migrations:
supabase db reset
AI Agent Development
New agents should follow the agent lifecycle:
Define Agent

      ↓

Register Agent

      ↓

Configure Tools

      ↓

Add Instructions

      ↓

Test Execution

      ↓

Deploy
Example agent structure:
agents/

└── evaluation-agent/

    ├── config.ts
    ├── instructions.md
    ├── tools.ts
    └── handler.ts
Testing Strategy
Testing should cover:
Application Layer
UI behavior
Component rendering
User flows
Agent Layer
Agent routing
Prompt behavior
Tool execution
Error handling
Integration Layer
Database communication
API requests
External services
Environment Validation
Before starting development, confirm:
✓ Dependencies installed

✓ Environment variables configured

✓ Database connection available

✓ AI provider configured

✓ Development server running

✓ Logs accessible
Developer Guidelines
Build Small, Test Often
Changes should be:
focused
reviewable
reversible
Document Architectural Decisions
Major decisions should include:
reason for change
alternatives considered
expected impact
Maintain Agent Transparency
AI behavior should remain:
understandable
traceable
measurable
Development Status
Repository: Kzknowledge/kzdi-agents-league
Environment: Local Development
Architecture: AI Agent Platform
Workflow: Git-based CI/CD Development
Next README section:
Section 4 — Environment Configuration
This will define:
required environment variables
secret management
development/staging/production separation
AI provider configuration
database configuration
security practices.

Environment Configuration

Overview

KZDI Agents League uses environment-based configuration to separate application behavior, infrastructure connections, AI providers, and security credentials across development, staging, and production environments.

Sensitive information must never be committed to the repository.

All secrets, API keys, database credentials, and service tokens must be managed through secure environment configuration.


Environment Architecture

The platform follows a three-environment model:

Development

                     ↓

                  Staging

                     ↓

                Production

Each environment maintains:

Independent configuration

Separate credentials

Isolated services

Controlled deployment access



Environment Files

Local development uses:

.env.local

Example:

kzdi-agents-league/

├── .env.local
├── .env.example
└── .gitignore


Environment Variable Template

Create a local environment file:

cp .env.example .env.local


Application Configuration

# Application

NODE_ENV=development

NEXT_PUBLIC_APP_URL=http://localhost:3000


Database Configuration

KZDI Agents League uses environment-based database connectivity.

# Database

DATABASE_URL=

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

Rules:

Public client keys may be exposed through frontend environment variables where required.

Server-side credentials must remain private.

Service-role credentials must never be used in client applications.


AI Gateway Configuration

The AI Gateway requires provider configuration.

# AI Gateway

AI_PROVIDER=

AI_MODEL=

AI_API_KEY=

Supported provider patterns:

openai

anthropic

gemini

local

custom-adapter

Example:

AI_PROVIDER=openai

AI_MODEL=model-name



Agent Runtime Configuration

Agent execution settings:

# Agent Runtime

AGENT_MODE=production

AGENT_TIMEOUT=30000

MAX_TOOL_CALLS=10

Purpose:

Variable	Description

AGENT_MODE	Controls execution environment
AGENT_TIMEOUT	Maximum agent execution duration
MAX_TOOL_CALLS	Prevents uncontrolled tool execution


Tool Integration Configuration

External integrations are configured through secured variables.

Example:

# External Services

API_BASE_URL=

WEBHOOK_SECRET=

INTEGRATION_TOKEN=

Requirements:

Credentials must be rotated periodically.

External requests must be authenticated.

All important actions must be logged.

Observability Configuration

The platform supports operational monitoring through telemetry configuration.

# Observability

LOG_LEVEL=info

TELEMETRY_ENDPOINT=

TELEMETRY_SECRET=

Tracked information includes:

Application events

Agent executions

Errors

Performance metrics

Workflow status



Security Configuration

Security-related settings:

# Security

JWT_SECRET=

SESSION_SECRET=

ENCRYPTION_KEY=

Security rules:

Never commit secrets

Never share production credentials

Rotate compromised keys immediately

Use different secrets per environment



Example .env.example

# Application

NODE_ENV=

NEXT_PUBLIC_APP_URL=


# Database

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=


# AI Gateway

AI_PROVIDER=

AI_MODEL=

AI_API_KEY=


# Agent Runtime

AGENT_MODE=

AGENT_TIMEOUT=


# Observability

TELEMETRY_ENDPOINT=

TELEMETRY_SECRET=


# Security

JWT_SECRET=

SESSION_SECRET=



Secret Management Rules

Development

Allowed:

Local .env.local

Developer-specific credentials

Test environments


Not allowed:

Production secrets

Shared credentials



Staging

Purpose:

Integration testing

Deployment validation

Agent behavior testing


Requirements:

Separate database

Separate AI credentials

Controlled access




Production

Production secrets must be managed through secure deployment platforms.

Requirements:

Encrypted storage

Access control

Audit logging

Rotation policy



Configuration Validation

Before deployment, verify:

✓ Required variables exist

✓ Database connection works

✓ AI provider credentials valid

✓ Agent runtime configured

✓ Telemetry endpoint reachable

✓ Secrets excluded from Git



Environment Security Checklist

[ ] .env files added to .gitignore

[ ] No API keys committed

[ ] Production secrets isolated

[ ] Access permissions reviewed

[ ] Credentials rotated when required

[ ] Environment variables documented

Configuration Design Principles

Separation:

Infrastructure configuration is independent from application code.

Security

Sensitive data remains outside source control.
    
Portability

The platform can run across different deployment environments.

Scalability

New services and AI providers can be added without restructuring the application.

Section Status: Production Configuration Draft
Repository: Kzknowledge/kzdi-agents-league
Purpose: Secure and portable runtime configuration


