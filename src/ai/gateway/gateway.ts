/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/gateway/gateway.ts
 *
 * Enterprise AI Gateway
 *
 * Responsibilities
 * - Provider registry
 * - Request routing
 * - Retry execution
 * - Response validation
 * - Telemetry hooks
 * - Provider health checks
 * ============================================================================
 */

import {
  AIProvider,
  CandidateProfile,
  EvaluationResult,
  AIHealthStatus,
  AIProviderName
} from "../provider";

import {
  getProviderConfig
} from "../config";

import {
  retry,
  isTransientError
} from "../../utils/retry";

import {
  createLogger
} from "../../config/logger";

const logger = createLogger("AI Gateway");

export class AIGateway {

  /**
   * Registered providers
   */
  private readonly providers =
    new Map<AIProviderName, AIProvider>();

  /**
   * Register provider.
   */
  register(
    provider: AIProvider
  ): void {

    this.providers.set(
      provider.provider,
      provider
    );

    logger.info(
      "AI provider registered",
      {
        provider: provider.provider,
        metadata: {
          model: provider.model
        }
      }
    );

  }

  /**
   * Retrieve provider.
   */
  getProvider(): AIProvider {

    const config = getProviderConfig();

    const provider =
      this.providers.get(config.provider);

    if (!provider) {

      throw new Error(
        `AI Provider '${config.provider}' not registered.`
      );

    }

    return provider;

  }

  /**
   * Evaluate candidate.
   */
  async evaluateCandidate(
    candidate: CandidateProfile
  ): Promise<EvaluationResult> {

    const provider =
      this.getProvider();

    logger.info(
      "Candidate evaluation started",
      {
        provider: provider.provider,
        metadata: {
          candidate: candidate.name
        }
      }
    );

    const result =
      await retry(
        () =>
          provider.evaluateCandidate(
            candidate
          ),
        {
          retryIf:
            isTransientError
        }
      );

    logger.info(
      "Candidate evaluation completed",
      {
        provider: provider.provider,
        metadata: {
          top_track:
            result.evaluation.top_track
        }
      }
    );

    return result;

  }

  /**
   * Provider health.
   */
  async healthCheck():
    Promise<
      Record<
        string,
        AIHealthStatus
      >
    > {

    const status:
      Record<
        string,
        AIHealthStatus
      > = {};

    for (
      const [
        name,
        provider
      ] of this.providers
    ) {

      try {

        status[name] =
          await provider.healthCheck();

      }

      catch (error) {

        logger.error(
          `Health check failed for ${name}`,
          error
        );

        status[name] = {

          provider: name,

          healthy: false,

          latency_ms: 0,

          message:
            error instanceof Error
              ? error.message
              : "Unknown error"

        };

      }

    }

    return status;

  }

  /**
   * Returns all registered providers.
   */
  listProviders():
    AIProviderName[] {

    return Array.from(
      this.providers.keys()
    );

  }

}

/**
 * Singleton Gateway
 */
export const aiGateway =
  new AIGateway();
