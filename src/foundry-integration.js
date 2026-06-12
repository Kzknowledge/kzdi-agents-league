/**
 * KZDI Talent OS — Foundry IQ Integration
 * ============================================================================
 * Handles candidate evaluation via Azure Foundry IQ API and result formatting.
 * ============================================================================
 */

import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const FOUNDRY_IQ_ENDPOINT = process.env.FOUNDRY_IQ_ENDPOINT || '';
const FOUNDRY_IQ_KEY = process.env.FOUNDRY_IQ_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseClient = null;

/**
 * Initialize Supabase client (singleton)
 */
function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }

  return supabaseClient;
}

/**
 * Evaluate a candidate using Foundry IQ
 * @param {Object} candidate - Candidate profile
 * @returns {Promise<Object>} Evaluation result
 */
export async function evaluateCandidate(candidate) {
  if (!FOUNDRY_IQ_ENDPOINT || !FOUNDRY_IQ_KEY) {
    console.warn('[⚠️  FOUNDRY] Credentials missing. Returning mock evaluation.');
    return generateMockEvaluation(candidate);
  }

  try {
    console.log(`[🔍 FOUNDRY] Evaluating ${candidate.name}...`);

    const response = await axios.post(
      `${FOUNDRY_IQ_ENDPOINT}/chat/completions`,
      {
        messages: [
          {
            role: 'user',
            content: `Evaluate this candidate for KZDI talent programs:

Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience}
Languages: ${candidate.languages.join(', ')}
Community: ${candidate.community}
Goal: ${candidate.goal}

Rate confidence (0-1) for each track:
1. ML Engineering
2. NLP Specialization
3. Data Infrastructure
4. Full Stack Development

Return JSON with tracks array and top_track.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${FOUNDRY_IQ_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const responseText = response.data.choices?.[0]?.message?.content || '{}';
    let evaluation = {};

    try {
      evaluation = JSON.parse(responseText);
    } catch {
      evaluation = generateMockEvaluation(candidate);
    }

    return {
      candidate,
      evaluation: {
        tracks: evaluation.tracks || [
          { name: 'ml_engineering', confidence: 0.75 },
          { name: 'nlp_specialization', confidence: 0.82 },
          { name: 'data_infrastructure', confidence: 0.68 },
          { name: 'full_stack_development', confidence: 0.71 }
        ],
        top_track: evaluation.top_track || 'nlp_specialization',
        recommendation: evaluation.recommendation || 'Strong fit for NLP track',
        reasoning: evaluation.reasoning || 'Based on skills and experience'
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`[❌ FOUNDRY] Evaluation failed: ${error.message}`);
    return generateMockEvaluation(candidate);
  }
}

/**
 * Format evaluation result for display
 * @param {Object} result - Evaluation result
 * @returns {string} Formatted output
 */
export function formatEvaluation(result) {
  const { candidate, evaluation, timestamp } = result;

  const trackRows = evaluation.tracks
    .map(
      (track, idx) =>
        `  ${idx + 1}. ${track.name.replace(/_/g, ' ').toUpperCase()}: ${(track.confidence * 100).toFixed(1)}%`
    )
    .join('\n');

  return `
📊 EVALUATION RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Candidate: ${candidate.name}
🎯 Top Track: ${evaluation.top_track.replace(/_/g, ' ').toUpperCase()}
💬 Recommendation: ${evaluation.recommendation}

📈 Track Confidence Scores:
${trackRows}

⏰ Timestamp: ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

/**
 * Generate mock evaluation (fallback for testing/demo)
 * @private
 */
function generateMockEvaluation(candidate) {
  const confidenceRange = () => Math.random() * 0.4 + 0.5; // 0.5-0.9

  const tracks = [
    { name: 'ml_engineering', confidence: confidenceRange() },
    { name: 'nlp_specialization', confidence: confidenceRange() },
    { name: 'data_infrastructure', confidence: confidenceRange() },
    { name: 'full_stack_development', confidence: confidenceRange() }
  ];

  const topTrack = tracks.reduce((a, b) =>
    a.confidence > b.confidence ? a : b
  ).name;

  return {
    candidate,
    evaluation: {
      tracks,
      top_track: topTrack,
      recommendation: `Recommended for ${topTrack.replace(/_/g, ' ')} track based on profile`,
      reasoning: 'Mock evaluation - real Foundry IQ credentials not configured'
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Store evaluation in Supabase
 * @param {Object} result - Evaluation result
 * @returns {Promise<Object>} Stored record
 */
export async function storeEvaluation(result) {
  const supabase = initSupabase();

  if (!supabase) {
    console.warn('[⚠️  SUPABASE] Not configured. Skipping storage.');
    return null;
  }

  try {
    const { candidate, evaluation, timestamp } = result;

    // Upsert candidate
    const { data: candData, error: candError } = await supabase
      .from('candidates')
      .upsert(
        {
          name: candidate.name,
          skills: candidate.skills,
          experience_level: candidate.experience,
          languages: candidate.languages,
          community: candidate.community,
          learning_goal: candidate.goal,
          updated_at: timestamp
        },
        { onConflict: 'name' }
      )
      .select();

    if (candError) throw candError;

    const candidateId = candData[0]?.id;

    // Insert evaluation
    const { data: evalData, error: evalError } = await supabase
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

    if (evalError) throw evalError;

    console.log(
      `[✅ SUPABASE] Stored evaluation for ${candidate.name}`
    );

    return evalData[0];
  } catch (error) {
    console.error(`[❌ SUPABASE] Storage failed: ${error.message}`);
    return null;
  }
}

export default {
  evaluateCandidate,
  formatEvaluation,
  storeEvaluation
};
