/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/config.ts
 *
 * AI Gateway Configuration
 *
 * Responsibilities
 * - AI provider configuration
 * - Model configuration
 * - Request defaults
 * - Timeout settings
 * - Prompt versioning
 * - Runtime validation
 * ============================================================================
 */

import { env } from "../config/env";
import type { AIProviderName } from "./provider";

export interface AIRequestConfig {
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  topP: number;
}

export interface PromptConfig {
  version: string;
  systemPrompt: string;
}

export interface AIProviderConfig {
  provider: AIProviderName;
  model: string;
  apiKey?: string;
  enabled: boolean;
}

export interface GatewayConfig {
  defaultProvider: AIProviderName;
  request: AIRequestConfig;
  prompt: PromptConfig;
  providers: Record<AIProviderName, AIProviderConfig>;
}

export const gatewayConfig: GatewayConfig = {

  defaultProvider: env.AI_PROVIDER,

  request: {

    temperature: 0.30,

    maxTokens: 1000,

    timeoutMs: env.AI_TIMEOUT_MS,

    topP: 0.95

  },

  prompt: {

    version: "v3.0.0",

    systemPrompt:
      "You are the KZDI Intelligence Gateway evaluation engine."

  },

  providers: {

    gemini: {

      provider: "gemini",

      model: env.AI_MODEL,

      apiKey: env.GEMINI_API_KEY,

      enabled: !!env.GEMINI_API_KEY

    },

    openai: {

      provider: "openai",

      model: "gpt-5.5",

      apiKey: env.OPENAI_API_KEY,

      enabled: !!env.OPENAI_API_KEY

    },

    anthropic: {

      provider: "anthropic",

      model: "claude-sonnet-4",

      apiKey: env.ANTHROPIC_API_KEY,

      enabled: !!env.ANTHROPIC_API_KEY

    },

    mock: {

      provider: "mock",

      model: "mock-provider",

      enabled: true

    }

  }

};

/**
 * Returns the active provider configuration.
 */
export function getProviderConfig(): AIProviderConfig {

  return gatewayConfig.providers[gatewayConfig.defaultProvider];

}

/**
 * Returns true if provider is configured.
 */
export function providerEnabled(
  provider: AIProviderName
): boolean {

  return gatewayConfig.providers[provider].enabled;

}

/**
 * Validate AI Gateway startup.
 */
export function validateGatewayConfiguration(): void {

  const provider = getProviderConfig();

  if (!provider.enabled) {

    throw new Error(
      `[AI Gateway] Provider '${provider.provider}' is not configured.`
    );

  }

}
