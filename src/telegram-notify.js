/**
 * Test Telegram Connection Script
 * Run with: node src/scripts/test-telegram.js
 */

import 'dotenv/config';
import { testConnection } from '../telegram-notify.js';

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 KZDI Talent OS — Telegram Connection Test');
  console.log('='.repeat(70) + '\n');

  // Check credentials
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN not configured');
    process.exit(1);
  }

  if (!chatId) {
    console.error('❌ TELEGRAM_ADMIN_CHAT_ID not configured');
    process.exit(1);
  }

  console.log('📋 Configuration:');
  console.log(`  Bot Token: ${botToken.substring(0, 10)}...`);
  console.log(`  Chat ID: ${chatId}\n`);

  // Test connection
  console.log('🔗 Testing connection...\n');
  
  try {
    const success = await testConnection();

    if (success) {
      console.log('\n✅ Telegram connection successful!');
      console.log('\n💬 You should receive a test message in your Telegram chat.\n');
      process.exit(0);
    } else {
      console.error('\n❌ Telegram connection test failed');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

