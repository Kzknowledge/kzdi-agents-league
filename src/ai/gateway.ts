// KZDI Intelligence Gateway entry point

import { AI_PROVIDER, AI_MODEL_CONFIG } from "../config";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { withRetry } from "../../utils/retry";
import type { AIProvider } from "../provider";
import type { EvaluationRequest, EvaluationResult } from "../../types/evaluation";
import { EVALUATION_TRACK_LABELS } from "../../config/constants";

const GEMINI_ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/**
 * Builds the evaluation prompt handed to Gemini. Kept deliberately strict
 * about output shape — the response is parsed as JSON, not free text.
 */
function buildPrompt(request: EvaluationRequest): string {
  const trackLabel = EVALUATION_TRACK_LABELS[request.track];

  return [
    `You are evaluating a candidate for the "${trackLabel}" track at KZDI Talent OS.`,
    `Score the following submission strictly on demonstrated competency, not phrasing or length.`,
    ``,
    `Candidate submission:`,
    request.submissionText,
    ``,
    `Respond with JSON only, in exactly this shape:`,
    `{`,
    `  "confidenceScore": number between 0 and 1,`,
    `  "skillMatrix": [{ "skill": string, "score": number 0-100 }],`,
    `  "recommendedRoles": string[],`,
    `  "cohensKappa": number between 0 and 1 representing scoring consistency,`,
    `  "rationale": string, one to two sentences`,
    `}`,
  ].join("\n");
}

function parseGeminiResponse(raw: unknown, track: EvaluationRequest["track"]): EvaluationResult {
  const text = (raw as any)?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini response did not contain expected text content");
  }

  // Model may wrap JSON in a markdown fence despite instructions — strip it defensively.
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  const parsed = JSON.parse(cleaned);

  return {
    track,
    confidenceScore: Number(parsed.confidenceScore),
    skillMatrix: parsed.skillMatrix ?? [],
    recommendedRoles: parsed.recommendedRoles ?? [],
    cohensKappa: Number(parsed.cohensKappa),
    rationale: String(parsed.rationale ?? ""),
    raw,
  };
}

class GeminiProvider implements AIProvider {
  readonly name = "gemini";

  async evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
    return withRetry(
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), AI_MODEL_CONFIG.timeoutMs);

        try {
          const response = await fetch(
            `${GEMINI_ENDPOINT(AI_MODEL_CONFIG.model)}?key=${env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
              body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(request) }] }],
                generationConfig: {
                  temperature: AI_MODEL_CONFIG.temperature,
                  maxOutputTokens: AI_MODEL_CONFIG.maxOutputTokens,
                  responseMimeType: "application/json",
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Gemini API responded with status ${response.status}`);
          }

          const body = await response.json();
          return parseGeminiResponse(body, request.track);
        } finally {
          clearTimeout(timeout);
        }
      },
      { label: "gemini.evaluate" }
    );
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(
        `${GEMINI_ENDPOINT(AI_MODEL_CONFIG.model)}?key=${env.GEMINI_API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] }) }
      );
      return response.ok;
    } catch (error) {
      logger.warn("Gemini health check failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

/** Provider registry — extend here if a second AI_PROVIDER value is introduced. */
function createProvider(providerName: string): AIProvider {
  switch (providerName) {
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error(
        `Unknown AI_PROVIDER "${providerName}". Only "gemini" is currently implemented.`
      );
  }
}

/** Singleton gateway instance used throughout the service. */
export const aiGateway: AIProvider = createProvider(AI_PROVIDER);
