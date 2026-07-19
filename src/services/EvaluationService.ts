/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Evaluation Service
 * ----------------------------------------------------------------------------
 * File: src/services/EvaluationService.ts
 *
 * Responsibilities
 * - Orchestrate candidate evaluations
 * - Coordinate repositories
 * - Invoke AI Gateway
 * - Persist evaluation results
 * - Record telemetry
 * ============================================================================
 */

import {
  CandidateProfile,
  EvaluationResult,
  aiGateway
} from "../ai";

import {
  CandidateRepository
} from "../database/repositories/CandidateRepository";

import {
  EvaluationRepository
} from "../database/repositories/EvaluationRepository";

import {
  TelemetryRepository
} from "../database/repositories/TelemetryRepository";

import {
  createLogger
} from "../config/logger";

const logger = createLogger("EvaluationService");

export class EvaluationService {

  constructor(

    private readonly candidateRepository =
      new CandidateRepository(),

    private readonly evaluationRepository =
      new EvaluationRepository(),

    private readonly telemetryRepository =
      new TelemetryRepository()

  ) {}

  /**
   * Evaluate candidate.
   */
  async evaluate(
    candidate: CandidateProfile
  ): Promise<EvaluationResult> {

    logger.info(
      "Evaluation started",
      {
        metadata: {
          candidate: candidate.name
        }
      }
    );

    const started = Date.now();

    try {

      /**
       * Step 1
       * Candidate Upsert
       */
      const storedCandidate =
        await this.candidateRepository.upsert(
          candidate
        );

      /**
       * Step 2
       * AI Evaluation
       */
      const result =
        await aiGateway.evaluateCandidate(
          candidate
        );

      /**
       * Step 3
       * Persist Evaluation
       */
      await this.evaluationRepository.create({

        candidateId:
          storedCandidate.id,

        evaluation:
          result.evaluation,

        provider:
          aiGateway.provider,

        model:
          aiGateway.model,

        latencyMs:
          Date.now() - started,

        promptVersion:
          "3.0.0"

      });

      /**
       * Step 4
       * Telemetry
       */
      await this.telemetryRepository.create({

        event_type:
          "candidate_evaluation",

        provider:
          aiGateway.provider,

        model:
          aiGateway.model,

        success: true,

        latency_ms:
          Date.now() - started,

        metadata: {

          candidateId:
            storedCandidate.id,

          candidate:
            candidate.name,

          topTrack:
            result.evaluation.top_track

        }

      });

      logger.info(
        "Evaluation completed",
        {
          metadata: {

            candidate:
              candidate.name,

            topTrack:
              result.evaluation.top_track

          }
        }
      );

      return result;

    }

    catch (error) {

      await this.telemetryRepository.create({

        event_type:
          "candidate_evaluation",

        provider:
          aiGateway.provider,

        model:
          aiGateway.model,

        success: false,

        latency_ms:
          Date.now() - started,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error"

      });

      logger.error(
        "Evaluation failed",
        error
      );

      throw error;

    }

  }

  /**
   * Evaluation history.
   */
  async history(
    candidateId: string
  ) {

    return this.evaluationRepository
      .findHistory(candidateId);

  }

  /**
   * Latest evaluation.
   */
  async latest(
    candidateId: string
  ) {

    return this.evaluationRepository
      .findLatestByCandidate(candidateId);

  }

    }
