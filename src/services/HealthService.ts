/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Health Service
 * ----------------------------------------------------------------------------
 * File: src/services/HealthService.ts
 *
 * Responsibilities
 * - Application health monitoring
 * - AI provider health
 * - Database health
 * - Environment validation
 * - Readiness reporting
 * ============================================================================
 */

import { aiGateway } from "../ai";
import { checkDatabaseHealth } from "../database/client";
import { env } from "../config/env";
import { createLogger } from "../config/logger";

const logger = createLogger("HealthService");

export interface HealthStatus {

  status: "healthy" | "degraded" | "unhealthy";

  version: string;

  timestamp: string;

  uptime: number;

  services: {

    ai: {

      healthy: boolean;

      provider: string;

      model: string;

      latency_ms?: number;

      message: string;

    };

    database: {

      healthy: boolean;

      message: string;

    };

    configuration: {

      healthy: boolean;

      missing: string[];

    };

  };

}

export class HealthService {

  /**
   * Full platform health check.
   */
  async check(): Promise<HealthStatus> {

    logger.info("Running health check...");

    const ai = await aiGateway.healthCheck();

    const database = await checkDatabaseHealth();

    const configuration =
      this.validateConfiguration();

    const healthy =
      ai.healthy &&
      database.healthy &&
      configuration.healthy;

    return {

      status:
        healthy
          ? "healthy"
          : "degraded",

      version: "3.0.0",

      timestamp:
        new Date().toISOString(),

      uptime:
        Math.floor(process.uptime()),

      services: {

        ai: {

          healthy:
            ai.healthy,

          provider:
            ai.provider,

          model:
            aiGateway.model,

          latency_ms:
            ai.latency_ms,

          message:
            ai.message

        },

        database: {

          healthy:
            database.healthy,

          message:
            database.message

        },

        configuration

      }

    };

  }

  /**
   * Validate required environment variables.
   */
  private validateConfiguration() {

    const missing: string[] = [];

    if (!env.GEMINI_API_KEY)
      missing.push("GEMINI_API_KEY");

    if (!env.SUPABASE_URL)
      missing.push("SUPABASE_URL");

    if (!env.SUPABASE_SERVICE_ROLE_KEY)
      missing.push("SUPABASE_SERVICE_ROLE_KEY");

    return {

      healthy:
        missing.length === 0,

      missing

    };

  }

  }
