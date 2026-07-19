/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Database Client
 * ----------------------------------------------------------------------------
 * File: src/database/client.ts
 *
 * Enterprise Supabase Client
 *
 * Responsibilities
 * - Singleton client creation
 * - Environment validation
 * - Service Role access
 * - Public client access
 * - Health check
 * ============================================================================
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { env } from "../config/env";
import { createLogger } from "../config/logger";

const logger = createLogger("Database");

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

/**
 * Service Role Client
 *
 * Used only by trusted backend services.
 */
export function getServiceClient(): SupabaseClient {

  if (serviceClient) {
    return serviceClient;
  }

  logger.info("Initializing Supabase Service Client");

  serviceClient = createClient(

    env.SUPABASE_URL,

    env.SUPABASE_SERVICE_ROLE_KEY,

    {

      auth: {

        autoRefreshToken: false,

        persistSession: false

      }

    }

  );

  return serviceClient;

}

/**
 * Public Client
 *
 * Safe for frontend/server operations
 * requiring only anonymous permissions.
 */
export function getAnonClient(): SupabaseClient {

  if (anonClient) {
    return anonClient;
  }

  logger.info("Initializing Supabase Public Client");

  anonClient = createClient(

    env.SUPABASE_URL,

    env.SUPABASE_KEY,

    {

      auth: {

        autoRefreshToken: false,

        persistSession: false

      }

    }

  );

  return anonClient;

}

/**
 * Database Health Check
 */
export async function checkDatabaseHealth() {

  try {

    const db = getServiceClient();

    const { error } = await db
      .from("telemetry_events")
      .select("id")
      .limit(1);

    if (error) {

      return {

        healthy: false,

        message: error.message

      };

    }

    return {

      healthy: true,

      message: "Database connection healthy."

    };

  }

  catch (error) {

    return {

      healthy: false,

      message:
        error instanceof Error
          ? error.message
          : "Unknown database error."

    };

  }

}

/**
 * Export default service client.
 */
export const db = getServiceClient();
