/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/providers/gemini/GeminiProvider.ts
 *
 * Enterprise Gemini Provider
 *
 * Responsibilities
 * - Build prompts
 * - Invoke Gemini client
 * - Validate AI responses
 * - Collect telemetry
 * - Return canonical evaluation
 * ============================================================================
 */

import {
  AIProvider,
  AIHealthStatus,
  CandidateProfile,
  EvaluationResult
} from "../../provider";

import { GeminiClient } from "./GeminiClient";

import {
  getSystemPrompt
} from "../../prompts/systemPrompt";

import {
  buildCandidateEvaluationPrompt
} from "../../prompts/candidateEvaluation";

import {
  validateProviderResponse
} from "../../validator/responseValidator";

import {
  recordAIRequest
} from "../../telemetry/aiTelemetry";

import {
  createLogger
} from "../../../config/logger";

import { env } from "../../../config/env";

const logger = createLogger("GeminiProvider");

export class GeminiProvider implements AIProvider {

  readonly provider = "gemini" as const;

  readonly model = env.AI_MODEL;

  constructor(
    private readonly client = new GeminiClient()
  ) {}

  /**
   * Evaluate candidate.
   */
  async evaluateCandidate(
    candidate: CandidateProfile
  ): Promise<EvaluationResult> {

    const started = Date.now();

    const { prompt, version } =
      buildCandidateEvaluationPrompt(candidate);

    logger.info(
      "Starting Gemini evaluation",
      {
        provider: this.provider,
        metadata: {
          candidate: candidate.name,
          promptVersion: version
        }
      }
    );

    const responseText =
      await this.client.generateText({

        systemInstruction: {

          parts: [
            {
              text: getSystemPrompt()
            }
          ]

        },

        contents: [

          {

            role: "user",

            parts: [
              {
                text: prompt
              }
            ]

          }

        ],

        generationConfig: {

          temperature: 0.30,

          topP: 0.95,

          maxOutputTokens: 1000

        }

      });

    const evaluation =
      validateProviderResponse(responseText);

    const latency =
      Date.now() - started;

    await recordAIRequest({

      provider: this.provider,

      model: this.model,

      latency_ms: latency,

      success: true,

      retries: 0

    });

    logger.info(
      "Gemini evaluation completed",
      {
        provider: this.provider,
        metadata: {
          latency_ms: latency,
          top_track:
            evaluation.top_track
        }
      }
    );

    return {

      candidate,

      evaluation,

      timestamp:
        new Date().toISOString()

    };

  }

  /**
   * Provider health check.
   */
  async healthCheck():
    Promise<AIHealthStatus> {

    const started =
      Date.now();

    try {

      await this.client.generate({

        contents: [

          {

            role: "user",

            parts: [

              {
                text: "Respond with OK."
              }

            ]

          }

        ]

      });

      return {

        provider: this.provider,

        healthy: true,

        latency_ms:
          Date.now() - started,

        message:
          "Gemini API reachable"

      };

    }

    catch (error) {

      return {

        provider: this.provider,

        healthy: false,

        latency_ms:
          Date.now() - started,

        message:
          error instanceof Error
            ? error.message
            : "Unknown error"

      };

    }

  }

          }
