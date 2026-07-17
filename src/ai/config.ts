export const AI_PROVIDER="gemini";

import { env } from "../config/env";

/** Model and call-tuning parameters for the active provider. */
export const AI_MODEL_CONFIG = {
  model: env.GEMINI_MODEL,
  temperature: 0.2, // low temperature — evaluation scoring should be consistent, not creative
  maxOutputTokens: 1024,
  timeoutMs: 15000,
} as const;
