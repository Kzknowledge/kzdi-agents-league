/**
 * KZDI Talent OS — Telegram Notifications
 * ============================================================================
 * Sends candidate evaluation results and batch notifications via Telegram.
 * Uses Telegram Bot API with error handling and reconnection logic.
 * ============================================================================
 */

import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const TELEGRAM_API = 'https://api.telegram.org';

/**
 * Send a notification about a single candidate evaluation
 * @param {Object} result - Evaluation result containing candidate and scores
 * @returns {Promise<boolean>} Success status
 */
export async function notifyEvaluation(result) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('[⚠️  TELEGRAM] Credentials missing. Skipping notification.');
    return false;
  }

  try {
    const { candidate, evaluation } = result;
    const topTrack = evaluation.top_track || 'Unknown';
    const confidence = evaluation.tracks?.[0]?.confidence || 0;

    const message = `
✅ <b>Candidate Evaluation Complete</b>

👤 <b>Candidate:</b> ${candidate.name}
🎯 <b>Top Track:</b> ${topTrack}
📊 <b>Confidence:</b> ${(confidence * 100).toFixed(1)}%
💬 <b>Skills:</b> ${candidate.skills.join(', ')}
🌍 <b>Languages:</b> ${candidate.languages.join(', ')}
🎓 <b>Goal:</b> ${candidate.goal}

<i>Evaluation stored and ready for review.</i>
    `.trim();

    return await sendMessage(message, 'HTML');
  } catch (error) {
    console.error(`[❌ TELEGRAM] Failed to notify evaluation: ${error.message}`);
    return false;
  }
}

/**
 * Send batch completion notification
 * @param {Array} results - Array of evaluation results
 * @returns {Promise<boolean>} Success status
 */
export async function notifyBatchComplete(results) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('[⚠️  TELEGRAM] Credentials missing. Skipping batch notification.');
    return false;
  }

  try {
    // Find top performer
    let topCandidate = null;
    let maxConfidence = 0;

    results.forEach(result => {
      const confidence = result.evaluation.tracks?.[0]?.confidence || 0;
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        topCandidate = result.candidate.name;
      }
    });

    const message = `
📊 <b>Batch Evaluation Complete</b>

✅ <b>Total Evaluated:</b> ${results.length}
🏆 <b>Top Performer:</b> ${topCandidate || 'N/A'}
📈 <b>Avg Confidence:</b> ${(results.reduce((sum, r) => sum + (r.evaluation.tracks?.[0]?.confidence || 0), 0) / results.length * 100).toFixed(1)}%

<i>All results have been stored in Supabase.</i>
    `.trim();

    return await sendMessage(message, 'HTML');
  } catch (error) {
    console.error(`[❌ TELEGRAM] Failed to notify batch: ${error.message}`);
    return false;
  }
}

/**
 * Test Telegram connection
 * @returns {Promise<boolean>} Connection status
 */
export async function testConnection() {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('[⚠️  TELEGRAM] Credentials not configured.');
    return false;
  }

  try {
    const message = `
🧪 <b>KZDI Talent OS Connection Test</b>

✅ Telegram bot is online and connected!
⏰ Timestamp: ${new Date().toISOString()}
    `.trim();

    return await sendMessage(message, 'HTML');
  } catch (error) {
    console.error(`[❌ TELEGRAM] Connection test failed: ${error.message}`);
    return false;
  }
}

/**
 * Send a message via Telegram Bot API
 * @private
 * @param {string} text - Message text
 * @param {string} parseMode - 'HTML', 'Markdown', or 'MarkdownV2'
 * @returns {Promise<boolean>} Send status
 */
async function sendMessage(text, parseMode = 'HTML') {
  if (!BOT_TOKEN || !CHAT_ID) {
    return false;
  }

  try {
    const url = `${TELEGRAM_API}/bot${BOT_TOKEN}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
      disable_notification: false
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.ok) {
      console.log('[✅ TELEGRAM] Message sent successfully');
      return true;
    } else {
      console.error(`[❌ TELEGRAM] API error: ${response.data.description}`);
      return false;
    }
  } catch (error) {
    console.error(`[❌ TELEGRAM] Send failed: ${error.message}`);
    return false;
  }
}

/**
 * Send error notification
 * @param {string} errorMessage - Error description
 * @param {string} context - Where the error occurred
 * @returns {Promise<boolean>} Send status
 */
export async function notifyError(errorMessage, context = 'Unknown') {
  if (!BOT_TOKEN || !CHAT_ID) {
    return false;
  }

  try {
    const message = `
❌ <b>Error in KZDI Talent OS</b>

📍 <b>Context:</b> ${context}
💬 <b>Error:</b> ${errorMessage}
⏰ <b>Time:</b> ${new Date().toISOString()}

<i>Please investigate immediately.</i>
    `.trim();

    return await sendMessage(message, 'HTML');
  } catch (error) {
    console.error(`[❌ TELEGRAM] Error notification failed: ${error.message}`);
    return false;
  }
}

export default {
  notifyEvaluation,
  notifyBatchComplete,
  testConnection,
  notifyError
};
