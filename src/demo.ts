/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Demo Entry Point
 * ----------------------------------------------------------------------------
 * File: src/demo.ts
 *
 * Runs one end-to-end candidate evaluation through the AI Gateway to prove
 * the wiring: EvaluationService -> AIGateway -> GeminiProvider -> Supabase.
 *
 * Normal runs require SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY.
 * DRY_RUN only requires the provider configuration needed to resolve the gateway.
 * ============================================================================
 */

import "dotenv/config";
import { validateEnvironment, env } from "./config/env";
import { validateGatewayConfiguration } from "./ai/config";
import { aiGateway } from "./ai";
import { EvaluationService } from "./services/EvaluationService";
import { createLogger } from "./config/logger";

const logger = createLogger("Demo");

async function main() {

  validateEnvironment();
  validateGatewayConfiguration();

  const sampleCandidate = {
    name: "Amina Yusuf",
    skills: ["Python", "SQL", "Data Cleaning"],
    experience: "2 years, self-taught, 3MTT Cohort 4 fellow",
    languages: ["Hausa", "English"],
    community: "Kano",
    goal: "Break into data infrastructure roles"
  };

  if (env.DRY_RUN) {

    // No live Gemini or Supabase calls — just prove the Gateway wiring
    // resolved correctly. This is what CI's DRY_RUN=true step checks.
    const activeProvider = aiGateway.getProvider();

    logger.info("DRY_RUN: skipping live evaluation", {
      metadata: {
        resolvedProvider: activeProvider.provider,
        resolvedModel: activeProvider.model,
        candidate: sampleCandidate.name
      }
    });

    console.log(JSON.stringify({
      dryRun: true,
      resolvedProvider: activeProvider.provider,
      resolvedModel: activeProvider.model
    }, null, 2));

    return;

  }

  const evaluationService = new EvaluationService();

  logger.info("Running sample evaluation", {
    metadata: { candidate: sampleCandidate.name }
  });

  const result = await evaluationService.evaluate(sampleCandidate);

  console.log(JSON.stringify(result, null, 2));

}

main().catch((error) => {
  logger.error("Demo run failed", error);
  process.exitCode = 1;
});
