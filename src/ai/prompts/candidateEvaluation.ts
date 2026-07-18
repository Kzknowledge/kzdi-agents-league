/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/prompts/candidateEvaluation.ts
 *
 * Candidate Evaluation Prompt Builder
 *
 * Responsibilities
 * - Build structured user prompts
 * - Validate candidate input
 * - Keep prompt construction deterministic
 * - Remain provider agnostic
 * ============================================================================
 */

import { Candidate } from "../../types/evaluation";

export const CANDIDATE_PROMPT_VERSION = "3.0.0";

export interface PromptBuildResult {
  version: string;
  prompt: string;
}

/**
 * Build evaluation prompt from candidate profile.
 */
export function buildCandidateEvaluationPrompt(
  candidate: Candidate
): PromptBuildResult {

  validateCandidate(candidate);

  const prompt = `
Evaluate the following candidate for the KZDI Talent OS.

Return ONLY valid JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Candidate Profile

Name:
${candidate.name}

Skills:
${candidate.skills.join(", ")}

Experience:
${candidate.experience}

Languages:
${candidate.languages.join(", ")}

Community:
${candidate.community ?? "Not provided"}

Learning Goal:
${candidate.goal ?? "Not provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Instructions

Evaluate the candidate for ALL four tracks.

Tracks:

1. ML Engineering

2. NLP Specialization

3. Data Infrastructure

4. Full Stack Development

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output Requirements

Return JSON ONLY.

{
  "tracks": [
    {
      "name": "ml_engineering",
      "confidence": 0.00
    },
    {
      "name": "nlp_specialization",
      "confidence": 0.00
    },
    {
      "name": "data_infrastructure",
      "confidence": 0.00
    },
    {
      "name": "full_stack_development",
      "confidence": 0.00
    }
  ],
  "top_track": "...",
  "recommendation": "...",
  "reasoning": "..."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rules

- Confidence values must be between 0.00 and 1.00.
- Always return all four tracks.
- Do not invent candidate information.
- Recommendation must be evidence-based.
- Reasoning should reference skills, experience, languages, and goals where applicable.
`.trim();

  return {
    version: CANDIDATE_PROMPT_VERSION,
    prompt
  };
}

/**
 * Validate candidate payload.
 */
function validateCandidate(candidate: Candidate): void {

  if (!candidate.name?.trim()) {
    throw new Error("Candidate name is required.");
  }

  if (!candidate.skills?.length) {
    throw new Error("Candidate skills are required.");
  }

  if (!candidate.languages?.length) {
    throw new Error("Candidate languages are required.");
  }

  if (!candidate.experience?.trim()) {
    throw new Error("Candidate experience is required.");
  }

}

/**
 * Prompt metadata.
 */
export const CANDIDATE_PROMPT_METADATA = {

  name: "Candidate Evaluation Prompt",

  version: CANDIDATE_PROMPT_VERSION,

  description:
    "Builds deterministic prompts for candidate evaluations."

}
