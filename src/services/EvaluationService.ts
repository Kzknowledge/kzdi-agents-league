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
    private readonly candidateRepository = new CandidateRepository(),
    private readonly evaluationRepository = new EvaluationRepository(),
    private readonly telemetryRepository = new TelemetryRepository()
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
        await this.candidateRepository.upsert(candidate);

      /**
       * Step 2
       * AI Evaluation
       */
      const result =
        await aiGateway.evaluateCandidate(candidate);

      /**
       * Step 3
       * Persist Evaluation
       *
       * UUID is the canonical application identity. The legacy bigint
       * candidate ID is retained only to satisfy the existing compatibility
       * foreign key until the database cutover is complete.
       */
      await this.evaluationRepository.create({
        candidateUuid: storedCandidate.candidate_uuid,
        legacyCandidateId: storedCandidate.id,
        evaluation: result.evaluation,
        provider: result.metadata.provider,
        model: result.metadata.model,
        latencyMs: Date.now() - started,
        promptVersion: "3.0.0"
      });

      /**
       * Step 4
       * Telemetry
       */
      await this.telemetryRepository.create({
        event_type: "candidate_evaluation",
        provider: result.metadata.provider,
        model: result.metadata.model,
        success: true,
        latency_ms: Date.now() - started,
        metadata: {
          candidateId: storedCandidate.candidate_uuid,
          candidateUuid: storedCandidate.candidate_uuid,
          candidate: candidate.name,
          topTrack: result.evaluation.top_track
        }
      });

      logger.info(
        "Evaluation completed",
        {
          metadata: {
            candidate: candidate.name,
            topTrack: result.evaluation.top_track
          }
        }
      );

      return result;
    }
    catch (error) {
      await this.telemetryRepository.create({
        event_type: "candidate_evaluation",
        provider: aiGateway.getProvider().provider,
        model: aiGateway.getProvider().model,
        success: false,
        latency_ms: Date.now() - started,
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
   * Evaluation history by canonical candidate UUID.
   */
  async history(
    candidateId: string
  ) {
    return this.evaluationRepository
      .findHistory(candidateId);
  }

  /**
   * Latest evaluation by canonical candidate UUID.
   */
  async latest(
    candidateId: string
  ) {
    return this.evaluationRepository
      .findLatestByCandidate(candidateId);
  }

}
