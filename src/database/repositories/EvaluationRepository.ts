/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Evaluation Repository
 * ----------------------------------------------------------------------------
 * File: src/database/repositories/EvaluationRepository.ts
 *
 * Responsibilities
 * - Store AI evaluations
 * - Retrieve evaluation history
 * - Latest evaluation lookup
 * - Analytics queries
 * ============================================================================
 */

import { SupabaseClient } from "@supabase/supabase-js";

import { getServiceClient } from "../client";

import { createLogger } from "../../config/logger";

import { EvaluationResponse } from "../../ai";

const logger = createLogger("EvaluationRepository");

export interface CreateEvaluationRequest {
  candidateUuid: string;
  legacyCandidateId: number;
  evaluation: EvaluationResponse;
  provider: string;
  model: string;
  latencyMs?: number;
  promptVersion?: string;
}

export class EvaluationRepository {

  constructor(
    private readonly db: SupabaseClient = getServiceClient()
  ) {}

  /**
   * Store evaluation using UUID as the canonical candidate identity while
   * retaining the legacy bigint foreign key for compatibility.
   */
  async create(
    request: CreateEvaluationRequest
  ) {
    const {
      candidateUuid,
      legacyCandidateId,
      evaluation,
      provider,
      model,
      latencyMs,
      promptVersion
    } = request;

    logger.info(
      "Creating evaluation",
      {
        metadata: {
          candidateUuid,
          legacyCandidateId,
          provider,
          model
        }
      }
    );

    const tracks = evaluation.tracks;

    const ml =
      tracks.find(t => t.name === "ml_engineering")?.confidence ?? 0;

    const nlp =
      tracks.find(t => t.name === "nlp_specialization")?.confidence ?? 0;

    const infra =
      tracks.find(t => t.name === "data_infrastructure")?.confidence ?? 0;

    const fullstack =
      tracks.find(t => t.name === "full_stack_development")?.confidence ?? 0;

    const { data, error } =
      await this.db
        .from("evaluations")
        .insert({
          candidate_id: legacyCandidateId,
          candidate_uuid: candidateUuid,
          ml_engineering_confidence: ml,
          nlp_specialization_confidence: nlp,
          data_infrastructure_confidence: infra,
          full_stack_confidence: fullstack,
          top_track: evaluation.top_track,
          recommendation: evaluation.recommendation,
          reasoning: evaluation.reasoning,
          full_evaluation: evaluation,
          provider,
          model,
          latency_ms: latencyMs,
          prompt_version: promptVersion,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
      logger.error("Evaluation creation failed", error);
      throw error;
    }

    return data;
  }

  /**
   * Latest evaluation for candidate by canonical UUID.
   */
  async findLatestByCandidate(
    candidateUuid: string
  ) {
    const { data, error } =
      await this.db
        .from("evaluations")
        .select("*")
        .eq("candidate_uuid", candidateUuid)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Evaluation history by canonical candidate UUID.
   */
  async findHistory(
    candidateUuid: string,
    limit = 20
  ) {
    const { data, error } =
      await this.db
        .from("evaluations")
        .select("*")
        .eq("candidate_uuid", candidateUuid)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Retrieve evaluation by canonical evaluation UUID.
   */
  async findById(
    id: string
  ) {
    const { data, error } =
      await this.db
        .from("evaluations")
        .select("*")
        .eq("evaluation_uuid", id)
        .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete evaluation by canonical evaluation UUID.
   */
  async delete(
    id: string
  ) {
    const { error } =
      await this.db
        .from("evaluations")
        .delete()
        .eq("evaluation_uuid", id);

    if (error) {
      throw error;
    }

    logger.info(
      "Evaluation deleted",
      {
        metadata: {
          evaluationUuid: id
        }
      }
    );
  }

}
