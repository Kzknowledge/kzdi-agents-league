/**
 * KZDI Talent OS — Supabase Client
 * ============================================================================
 * Manages persistent storage of evaluations and candidate data.
 * 
 * Tables:
 * - candidates: Core candidate profile data
 * - evaluations: Foundry IQ evaluation results
 * - audit_log: All operations for compliance
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

let supabaseClient = null;

/**
 * Initialize Supabase client (singleton pattern)
 * @returns {Object} Supabase client instance
 */
export function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[⚠️  SUPABASE] Credentials missing. Data persistence disabled.');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[✅ SUPABASE] Client initialized');
  }

  return supabaseClient;
}

/**
 * Store evaluation result in Supabase
 * @param {Object} result - Evaluation result from Foundry
 * @returns {Promise<Object>} Stored record
 */
export async function storeEvaluation(result) {
  const client = initSupabase();
  
  if (!client) {
    console.warn('[⚠️  SUPABASE] Skipping evaluation storage (not configured)');
    return null;
  }

  try {
    const { candidate, evaluation, timestamp } = result;

    // First, upsert candidate
    const { data: candidateData, error: candError } = await client
      .from('candidates')
      .upsert({
        name: candidate.name,
        skills: candidate.skills,
        experience_level: candidate.experience,
        languages: candidate.languages,
        community: candidate.community,
        learning_goal: candidate.goal,
        updated_at: timestamp
      }, {
        onConflict: 'name'
      })
      .select();

    if (candError) {
      throw new Error(`Candidate upsert failed: ${candError.message}`);
    }

    const candidateId = candidateData[0].id;

    // Then, insert evaluation
    const { data: evalData, error: evalError } = await client
      .from('evaluations')
      .insert({
        candidate_id: candidateId,
        ml_engineering_confidence: evaluation.tracks[0].confidence,
        nlp_specialization_confidence: evaluation.tracks[1].confidence,
        data_infrastructure_confidence: evaluation.tracks[2].confidence,
        full_stack_confidence: evaluation.tracks[3].confidence,
        top_track: evaluation.top_track,
        recommendation: evaluation.recommendation,
        full_evaluation: evaluation,
        created_at: timestamp
      })
      .select();

    if (evalError) {
      throw new Error(`Evaluation insert failed: ${evalError.message}`);
    }

    // Log audit
    await logAudit({
      action: 'evaluation_stored',
      candidate_name: candidate.name,
      candidate_id: candidateId,
      evaluation_id: evalData[0].id,
      status: 'success'
    });

    console.log(`[✅ SUPABASE] Evaluation stored for ${candidate.name} (ID: ${evalData[0].id})`);
    
    return evalData[0];
  } catch (error) {
    console.error(`[❌ SUPABASE] Error storing evaluation: ${error.message}`);
    
    await logAudit({
      action: 'evaluation_failed',
      candidate_name: result.candidate.name,
      status: 'error',
      error_message: error.message
    });
    
    throw error;
  }
}

/**
 * Retrieve candidate evaluations
 * @param {string} candidateName - Name to search for
 * @returns {Promise<Array>} Matching evaluations
 */
export async function getCandidateEvaluations(candidateName) {
  const client = initSupabase();
  
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('evaluations')
      .select('*, candidates(name, skills, experience_level)')
      .eq('candidates.name', candidateName)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`[❌ SUPABASE] Error fetching evaluations: ${error.message}`);
    return [];
  }
}

/**
 * Get leaderboard of top candidates by talent track
 * @param {string} track - Talent track name
 * @param {number} limit - Number of results (default: 10)
 * @returns {Promise<Array>} Top candidates for track
 */
export async function getLeaderboard(track, limit = 10) {
  const client = initSupabase();
  
  if (!client) {
    return [];
  }

  try {
    const confidenceColumn = mapTrackToColumn(track);
    
    const { data, error } = await client
      .from('evaluations')
      .select(`
        id,
        created_at,
        ${confidenceColumn},
        candidates(name, community, learning_goal)
      `)
      .order(confidenceColumn, { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`[❌ SUPABASE] Error fetching leaderboard: ${error.message}`);
    return [];
  }
}

/**
 * Log audit event
 * @private
 */
async function logAudit(event) {
  const client = initSupabase();
  
  if (!client) {
    return;
  }

  try {
    await client
      .from('audit_log')
      .insert({
        action: event.action,
        details: JSON.stringify(event),
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.warn(`[⚠️  SUPABASE] Audit log failed: ${error.message}`);
  }
}

/**
 * Map talent track name to confidence column
 * @private
 */
function mapTrackToColumn(track) {
  const mapping = {
    'machine_learning_engineering': 'ml_engineering_confidence',
    'nlp_specialization': 'nlp_specialization_confidence',
    'data_infrastructure': 'data_infrastructure_confidence',
    'full_stack_development': 'full_stack_confidence'
  };
  
  return mapping[track] || 'top_track';
}

/**
 * Verify Supabase connection
 * @returns {Promise<boolean>} Connection status
 */
export async function verifyConnection() {
  const client = initSupabase();
  
  if (!client) {
    return false;
  }

  try {
    const { error } = await client
      .from('candidates')
      .select('count', { count: 'exact' })
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('[✅ SUPABASE] Connection verified');
    return true;
  } catch (error) {
    console.error(`[❌ SUPABASE] Connection failed: ${error.message}`);
    return false;
  }
}

export default {
  initSupabase,
  storeEvaluation,
  getCandidateEvaluations,
  getLeaderboard,
  verifyConnection
};

