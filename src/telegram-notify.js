// src/telegram-notify.js
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates a clean visual progress bar for confidence metrics
 * @param {number} score - Confidence score between 0.0 and 1.0
 * @returns {string} - Progress bar using square emojis
 */
const generateProgressBar = (score) => {
  const visualTotal = 10;
  const normalizedScore = Math.min(Math.max(score, 0), 1); // Guardrail to keep score between 0 and 1
  const filledBlocks = Math.round(normalizedScore * visualTotal);
  const emptyBlocks = visualTotal - filledBlocks;
  return "🟩".repeat(filledBlocks) + "⬜".repeat(emptyBlocks);
};

/**
 * Dispatches a single formatted markdown evaluation message to Telegram
 * @param {string} text - Formatted message string
 */
async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram configuration missing. Skipping alert dispatch.");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown' // Required to parse bolding, emojis, and styling layout
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Telegram API responded with status ${response.status}: ${errBody}`);
    }
  } catch (error) {
    console.error("❌ Failed to broadcast notification over Telegram:", error);
  }
}

/**
 * Notifies admin of a single candidate evaluation with high-visibility layout
 * @param {Object} result - Evaluation model object from the AI engine
 */
export async function notifyEvaluation(result) {
  if (process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'false') return;

  // Handles dynamic mapping checking for either structural variant (.confidence or track specific numbers)
  const score = result.confidence || result[`${result.top_track}_confidence`] || 0;

  const message = `
👤 **Candidate:** ${result.name || 'Unknown Applicant'}
🎯 **Top Track Placement:** ${String(result.top_track).replace(/_/g, ' ').toUpperCase()}
📊 **Confidence Score:** ${(score * 100).toFixed(1)}%
${generateProgressBar(score)}

🛠️ **Extracted Competencies:**
${Array.isArray(result.skills) ? result.skills.map(s => `• ${s}`).join('\n') : '• Mixed technical skills'}

🌍 **Languages:** ${Array.isArray(result.languages) ? result.languages.join(', ') : 'English, Hausa'}
💡 **Stated Learning Goal:** _"${result.recommendation || 'Evaluation stored and ready for review.'}"_
`;

  await sendTelegramMessage(message.trim());
}

/**
 * Notifies admin of a complete processing run summary
 * @param {Array<Object>} results - Collection of evaluated candidate records
 */
export async function notifyBatchComplete(results) {
  if (process.env.ENABLE_TELEGRAM_NOTIFICATIONS === 'false') return;
  if (!results || results.length === 0) return;

  const totalEvaluated = results.length;
  
  // Calculate average confidence dynamically
  const totalConfidence = results.reduce((sum, res) => {
    const score = res.confidence || res[`${res.top_track}_confidence`] || 0;
    return sum + score;
  }, 0);
  const avgConfidence = totalConfidence / totalEvaluated;

  // Locate highest performing profile in the payload array
  const topPerformerObj = results.reduce((prev, current) => {
    const prevScore = prev.confidence || prev[`${prev.top_track}_confidence`] || 0;
    const currScore = current.confidence || current[`${current.top_track}_confidence`] || 0;
    return (currScore > prevScore) ? current : prev;
  });

  const batchMessage = `
📊 **Batch Evaluation Complete**
${"─".repeat(20)}

✅ **Total Evaluated:** ${totalEvaluated} Profiles
🏆 **Top Performer:** ${topPerformerObj.name || 'N/A'}
📈 **Avg Confidence:** ${(avgConfidence * 100).toFixed(1)}%
${generateProgressBar(avgConfidence)}

_All evaluation matrices have been securely synchronized and persisted into Supabase._
`;

  await sendTelegramMessage(batchMessage.trim());
}
