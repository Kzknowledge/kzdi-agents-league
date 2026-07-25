/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * AI Module Public API
 * ============================================================================
 */

export * from "./config";

export * from "./gateway";

export * from "./providers";

export * from "./prompts";

export * from "./schemas";

export * from "./validator";

export * from "./telemetry";

/**
 * ============================================================================
 * Provider Registration Bootstrap
 * ----------------------------------------------------------------------------
 * Registers each enabled provider with the AI Gateway singleton on module
 * load. Only Gemini has a concrete implementation today; openai/anthropic
 * are typed in config.ts but have no provider class yet (see providers/index.ts).
 * ============================================================================
 */

import { aiGateway } from "./gateway";
import { providerEnabled } from "./config";
import { GeminiProvider } from "./providers";

if (providerEnabled("gemini")) {
  aiGateway.register(new GeminiProvider());
}
