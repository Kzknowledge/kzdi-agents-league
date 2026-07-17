/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/config/env.ts
 *
 * Enterprise Environment Configuration Loader
 *
 * Responsibilities
 * - Validate required environment variables
 * - Apply secure defaults
 * - Provide strongly typed configuration
 * - Fail fast on invalid production configuration
 * ============================================================================
 */

type AIProvider =
  | "gemini"
  | "openai"
  | "anthropic"
  | "mock";

interface EnvironmentConfig {
  // AI Gateway
  AI_PROVIDER: AIProvider;
  AI_MODEL: string;

  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;

  AI_TIMEOUT_MS: number;
  AI_MAX_RETRIES: number;
  AI_RETRY_BACKOFF_MS: number;

  // Supabase
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Telegram
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_ADMIN_CHAT_ID?: string;

  ENABLE_TELEGRAM_NOTIFICATIONS: boolean;

  // Runtime
  DEBUG: boolean;
  DRY_RUN: boolean;

  // Observability
  ENABLE_AI_TELEMETRY: boolean;
  LOG_PROMPTS: boolean;
  LOG_RESPONSES: boolean;

  NODE_ENV: "development" | "test" | "production";
}

/**
 * Reads an environment variable.
 */
function getEnv(
  key: string,
  defaultValue?: string
): string {

  const value = process.env[key] ?? defaultValue;

  if (value === undefined) {
    throw new Error(
      `[ENV] Missing required environment variable: ${key}`
    );
  }

  return value;
}

/**
 * Boolean parser.
 */
function toBoolean(value: string): boolean {

  return value.toLowerCase() === "true";

}

/**
 * Number parser.
 */
function toNumber(
  value: string,
  key: string
): number {

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(
      `[ENV] ${key} must be a valid number`
    );
  }

  return parsed;

}

/**
 * Validate provider.
 */
function getProvider(): AIProvider {

  const provider = getEnv(
    "AI_PROVIDER",
    "gemini"
  ) as AIProvider;

  const supported = [
    "gemini",
    "openai",
    "anthropic",
    "mock"
  ];

  if (!supported.includes(provider)) {

    throw new Error(
      `[ENV] Unsupported AI_PROVIDER: ${provider}`
    );

  }

  return provider;

}

/**
 * Centralized configuration.
 */
export const env: EnvironmentConfig = {

  AI_PROVIDER: getProvider(),

  AI_MODEL: getEnv(
    "AI_MODEL",
    "gemini-2.5-pro"
  ),

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  ANTHROPIC_API_KEY:
    process.env.ANTHROPIC_API_KEY,

  AI_TIMEOUT_MS: toNumber(
    getEnv("AI_TIMEOUT_MS", "30000"),
    "AI_TIMEOUT_MS"
  ),

  AI_MAX_RETRIES: toNumber(
    getEnv("AI_MAX_RETRIES", "3"),
    "AI_MAX_RETRIES"
  ),

  AI_RETRY_BACKOFF_MS: toNumber(
    getEnv("AI_RETRY_BACKOFF_MS", "1000"),
    "AI_RETRY_BACKOFF_MS"
  ),

  SUPABASE_URL: getEnv(
    "SUPABASE_URL"
  ),

  SUPABASE_SERVICE_ROLE_KEY:
    getEnv(
      "SUPABASE_SERVICE_ROLE_KEY"
    ),

  TELEGRAM_BOT_TOKEN:
    process.env.TELEGRAM_BOT_TOKEN,

  TELEGRAM_ADMIN_CHAT_ID:
    process.env.TELEGRAM_ADMIN_CHAT_ID,

  ENABLE_TELEGRAM_NOTIFICATIONS:
    toBoolean(
      getEnv(
        "ENABLE_TELEGRAM_NOTIFICATIONS",
        "true"
      )
    ),

  DEBUG:
    toBoolean(
      getEnv("DEBUG", "false")
    ),

  DRY_RUN:
    toBoolean(
      getEnv("DRY_RUN", "false")
    ),

  ENABLE_AI_TELEMETRY:
    toBoolean(
      getEnv(
        "ENABLE_AI_TELEMETRY",
        "true"
      )
    ),

  LOG_PROMPTS:
    toBoolean(
      getEnv(
        "LOG_PROMPTS",
        "false"
      )
    ),

  LOG_RESPONSES:
    toBoolean(
      getEnv(
        "LOG_RESPONSES",
        "false"
      )
    ),

  NODE_ENV:
    (process.env.NODE_ENV as
      | "development"
      | "test"
      | "production") ??
    "development"

};

/**
 * Validate startup configuration.
 *
 * Fail fast before the application starts serving requests.
 */
export function validateEnvironment(): void {

  switch (env.AI_PROVIDER) {

    case "gemini":

      if (!env.GEMINI_API_KEY) {

        throw new Error(
          "[ENV] GEMINI_API_KEY is required."
        );

      }

      break;

    case "openai":

      if (!env.OPENAI_API_KEY) {

        throw new Error(
          "[ENV] OPENAI_API_KEY is required."
        );

      }

      break;

    case "anthropic":

      if (!env.ANTHROPIC_API_KEY) {

        throw new Error(
          "[ENV] ANTHROPIC_API_KEY is required."
        );

      }

      break;

    case "mock":

      // No credentials required.
      break;

  }

  }
