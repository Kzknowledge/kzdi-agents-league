/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Candidate Repository
 * ----------------------------------------------------------------------------
 * File: src/database/repositories/CandidateRepository.ts
 *
 * Responsibilities
 * - Candidate CRUD
 * - Candidate lookup
 * - Candidate upsert
 * - Database abstraction
 * ============================================================================
 */

import { SupabaseClient } from "@supabase/supabase-js";

import { getServiceClient } from "../client";

import { createLogger } from "../../config/logger";

import { CandidateProfile } from "../../ai/provider";

const logger = createLogger("CandidateRepository");

export class CandidateRepository {

  constructor(
    private readonly db: SupabaseClient = getServiceClient()
  ) {}

  /**
   * Create or update candidate.
   */
  async upsert(
    candidate: CandidateProfile
  ) {

    logger.info(
      "Upserting candidate",
      {
        metadata: {
          name: candidate.name
        }
      }
    );

    const { data, error } =
      await this.db
        .from("candidates")
        .upsert(
          {
            name: candidate.name,

            skills: candidate.skills,

            experience_level:
              candidate.experience,

            languages:
              candidate.languages,

            community:
              candidate.community,

            learning_goal:
              candidate.goal,

            updated_at:
              new Date().toISOString()

          },
          {
            onConflict: "name"
          }
        )
        .select()
        .single();

    if (error) {

      logger.error(
        "Candidate upsert failed",
        error
      );

      throw error;

    }

    return data;

  }

  /**
   * Find candidate by ID.
   */
  async findById(
    id: string
  ) {

    const { data, error } =
      await this.db
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

      throw error;

    }

    return data;

  }

  /**
   * Find candidate by name.
   */
  async findByName(
    name: string
  ) {

    const { data, error } =
      await this.db
        .from("candidates")
        .select("*")
        .eq("name", name)
        .maybeSingle();

    if (error) {

      throw error;

    }

    return data;

  }

  /**
   * List candidates.
   */
  async list(
    limit = 50
  ) {

    const { data, error } =
      await this.db
        .from("candidates")
        .select("*")
        .order(
          "updated_at",
          {
            ascending: false
          }
        )
        .limit(limit);

    if (error) {

      throw error;

    }

    return data;

  }

  /**
   * Delete candidate.
   */
  async delete(
    id: string
  ) {

    const { error } =
      await this.db
        .from("candidates")
        .delete()
        .eq("id", id);

    if (error) {

      throw error;

    }

    logger.info(
      "Candidate deleted",
      {
        metadata: {
          id
        }
      );

  }

        }
