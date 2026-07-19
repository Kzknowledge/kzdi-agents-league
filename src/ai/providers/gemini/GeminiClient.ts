/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/providers/gemini/GeminiClient.ts
 *
 * Enterprise Gemini Client
 *
 * Responsibilities
 * - Gemini API communication
 * - Authentication
 * - Timeout handling
 * - Retry support
 * - Structured logging
 * ============================================================================
 */

import { env } from "../../../config/env";
import { createLogger } from "../../../config/logger";
import { retry, isTransientError } from "../../../utils/retry";

const logger = createLogger("GeminiClient");

export interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

export interface GeminiGenerateRequest {
  systemInstruction?: {
    parts: {
      text: string;
    }[];
  };
  contents: GeminiMessage[];
  generationConfig?: {
    temperature: number;
    topP: number;
    maxOutputTokens: number;
  };
}

export interface GeminiGenerateResponse {
  candidates?: {
    content?: {
      parts?: {
        text: string;
      }[];
    };
    finishReason?: string;
  }[];

  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

export class GeminiClient {

  private readonly apiKey = env.GEMINI_API_KEY;

  private readonly model = env.AI_MODEL;

  private readonly endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

  async generate(
    request: GeminiGenerateRequest
  ): Promise<GeminiGenerateResponse> {

    return retry(

      async () => {

        const controller =
          new AbortController();

        const timeout = setTimeout(

          () => controller.abort(),

          env.AI_TIMEOUT_MS

        );

        try {

          logger.info(
            "Calling Gemini API..."
          );

          const response =
            await fetch(

              `${this.endpoint}?key=${this.apiKey}`,

              {

                method: "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body: JSON.stringify(
                  request
                ),

                signal:
                  controller.signal

              }

            );

          if (!response.ok) {

            const body =
              await response.text();

            throw new Error(
              `Gemini API ${response.status}: ${body}`
            );

          }

          return await response.json();

        }

        finally {

          clearTimeout(timeout);

        }

      },

      {

        retryIf:
          isTransientError

      }

    );

  }

  async generateText(
    request: GeminiGenerateRequest
  ): Promise<string> {

    const response =
      await this.generate(
        request
      );

    const text =
      response.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!text) {

      throw new Error(
        "Gemini returned an empty response."
      );

    }

    return text;

  }

}
