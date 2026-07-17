/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/provider.ts
 * Description:
 *   Provider contracts and shared types for the AI Gateway.
 *
 * All AI providers MUST implement this interface.
 * ============================================================================
 */

export type AIProviderName =
  | "gemini"
  | "openai"
  | "anthropic"
  | "mock";

export interface CandidateProfile {
  id?: string;

  name: string;

  skills: string[];

  experience: string;

  languages: string[];

  community?: string;

  goal?: string;
}

export interface EvaluationTrack {

  name: string;

  confidence: number;

}

export interface EvaluationResult {

  candidate: CandidateProfile;

  evaluation: {

    tracks: EvaluationTrack[];

    top_track: string;

    recommendation: string;

    reasoning: string;

  };

  metadata: {

    provider: AIProviderName;

    model: string;

    latency_ms: number;

    request_id: string;

    timestamp: string;

  };

}

export interface AIHealthStatus {

  healthy: boolean;

  provider: AIProviderName;

  latency_ms: number;

  message: string;

}

export interface AIProvider {

  readonly provider: AIProviderName;

  readonly model: string;

  /**
   * Evaluate candidate.
   */
  evaluateCandidate(
    candidate: CandidateProfile
  ): Promise<EvaluationResult>;

  /**
   * Health check.
   */
  healthCheck(): Promise<AIHealthStatus>;

}
