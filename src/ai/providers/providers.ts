import type { EvaluationRequest, EvaluationResult } from "../types/evaluation";

/**
 * Contract for a pluggable AI evaluation backend. The active provider is
 * selected in ai/config.ts via AI_PROVIDER and instantiated in
 * ai/gateway/gateway.ts — swapping providers should never require
 * changes to EvaluationService.
 */
export interface AIProvider {
  /** Machine-readable provider identifier, e.g. "gemini". */
  readonly name: string;

  /** Scores a candidate submission and returns a structured result. */
  evaluate(request: EvaluationRequest): Promise<EvaluationResult>;

  /** Lightweight reachability check, used by health/readiness endpoints. */
  healthCheck(): Promise<boolean>;
}
