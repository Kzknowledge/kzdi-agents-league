/**
 * KZDI Talent OS — Demo & Main Executor
 * ============================================================================
 * Entry point for running candidate evaluations end-to-end.
 * 
 * Flow:
 * 1. Load environment variables
 * 2. Initialize clients (Foundry, Supabase, Telegram)
 * 3. Define candidate pool
 * 4. Evaluate each candidate via Foundry IQ
 * 5. Store results in Supabase
 * 6. Send Telegram notifications
 * 7. Display formatted results
 * ============================================================================
 */

import 'dotenv/config';
import { evaluateCandidate, formatEvaluation } from './foundry-integration.js';
import { initSupabase, storeEvaluation, verifyConnection } from './supabase-client.js';
import { notifyEvaluation, notifyBatchComplete, testConnection } from './telegram-notify.js';

// Configuration
const DRY_RUN = process.env.DRY_RUN === 'true';
const DEBUG = process.env.DEBUG === 'true';

/**
 * Sample candidates for demonstration
 */
const SAMPLE_CANDIDATES = [
  {
    name: 'Chioma Okafor',
    skills: ['Python', 'PyTorch', 'Transformers'],
    experience: 'intermediate',
    languages: ['English', 'Igbo'],
    community: 'hausa_nlp_track',
    goal: 'Work with Hausa language data'
  },
  {
    name: 'Amir Hassan',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    experience: 'intermediate',
    languages: ['English', 'Hausa'],
    community: 'fullstack_builders',
    goal: 'Build scalable web applications'
  },
  {
    name: 'Zainab Musa',
    skills: ['SQL', 'Python', 'Airflow', 'BigQuery', 'dbt'],
    experience: 'advanced',
    languages: ['English', 'Hausa', 'Fulani'],
    community: 'data_engineers_ng',
    goal: 'Lead data infrastructure projects'
  }
];

/**
 * Main execution function
 */
async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 KZDI TALENT OS — Candidate Evaluation Engine');
  console.log('='.repeat(70) + '\n');

  try {
    // Step 1: Verify environment
    console.log('[📋 SETUP] Verifying environment...');
    verifyEnvironment();

    // Step 2: Initialize clients
    console.log('\n[🔌 INIT] Initializing clients...');
    const supabase = initSupabase();
    
    if (supabase) {
      const supabaseOk = await verifyConnection();
      if (!supabaseOk && !DRY_RUN) {
        console.warn('[⚠️  SETUP] Supabase not available. Results will not be persisted.');
      }
    }

    const telegramOk = await testConnection();
    if (!telegramOk && !DRY_RUN) {
      console.warn('[⚠️  SETUP] Telegram not available. Notifications will be skipped.');
    }

    // Step 3: Evaluate candidates
    console.log('\n[👥 EVAL] Starting candidate evaluations...\n');
    const results = [];

    for (const candidate of SAMPLE_CANDIDATES) {
      try {
        if (DRY_RUN) {
          console.log(`[🏃 DRY RUN] Skipping evaluation for ${candidate.name}`);
          continue;
        }

        const result = await evaluateCandidate(candidate);
        results.push(result);

        // Display formatted result
        console.log(formatEvaluation(result));

        // Store in Supabase
        if (supabase) {
          try {
            await storeEvaluation(result);
          } catch (error) {
            console.warn(`[⚠️  STORAGE] Failed to store: ${error.message}`);
          }
        }

        // Send notification
        try {
          await notifyEvaluation(result);
        } catch (error) {
          console.warn(`[⚠️  NOTIFY] Failed to notify: ${error.message}`);
        }

        // Small delay between requests
        await sleep(500);
      } catch (error) {
        console.error(`[❌ ERROR] Failed to evaluate ${candidate.name}:`);
        console.error(`  ${error.message}\n`);
      }
    }

    // Step 4: Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 EVALUATION SUMMARY');
    console.log('='.repeat(70) + '\n');

    console.log(`✅ Successfully evaluated: ${results.length}/${SAMPLE_CANDIDATES.length}`);
    
    if (results.length > 0) {
      // Show top performer across all tracks
      const allTracks = results.flatMap(r => r.evaluation.tracks);
      const topByTrack = {};
      
      allTracks.forEach(track => {
        if (!topByTrack[track.name] || track.confidence > topByTrack[track.name].confidence) {
          topByTrack[track.name] = track;
        }
      });

      console.log('\n🏆 Top Confidence by Track:\n');
      Object.entries(topByTrack).forEach(([trackName, track]) => {
        const candidates = results.filter(r => 
          r.evaluation.tracks.find(t => t.name === trackName && t.confidence === track.confidence)
        );
        console.log(`  ${trackName}: ${(track.confidence * 100).toFixed(1)}%`);
      });

      // Send batch notification
      try {
        await notifyBatchComplete(results);
      } catch (error) {
        console.warn(`[⚠️  NOTIFY] Batch notification failed: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✨ Evaluation cycle complete!');
    console.log('='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n[❌ FATAL] Evaluation failed:');
    console.error(`  ${error.message}\n`);
    process.exit(1);
  }
}

/**
 * Verify environment variables are set
 * @private
 */
function verifyEnvironment() {
  const required = ['FOUNDRY_IQ_KEY', 'FOUNDRY_IQ_ENDPOINT'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('  ✓ FOUNDRY_IQ_KEY');
  console.log('  ✓ FOUNDRY_IQ_ENDPOINT');
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    console.log('  ✓ Supabase configured');
  } else {
    console.log('  ⚠ Supabase not configured (data persistence disabled)');
  }

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID) {
    console.log('  ✓ Telegram configured');
  } else {
    console.log('  ⚠ Telegram not configured (notifications disabled)');
  }
}

/**
 * Sleep utility
 * @private
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Run main if this is the entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('[❌ FATAL]', error);
    process.exit(1);
  });
}

export { main };

