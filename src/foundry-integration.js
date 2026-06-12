import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function evaluateCandidate(candidate) {
  try {
    const response = await axios.post(
      `${process.env.FOUNDRY_IQ_ENDPOINT}/chat/completions`,
      {
        messages: [
          {
            role: 'user',
            content: `Name: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience} (${candidate.yearsInTech} years)
Languages: ${candidate.languages.join(', ')}
Community: ${candidate.community}
Learning goal: ${candidate.learningGoal}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.FOUNDRY_IQ_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reasoning = JSON.parse(response.data.choices[0].message.content);

    // Store in Supabase
    await supabase.from('evaluations').insert({
      candidate_id: candidate.id || crypto.randomUUID(),
      assigned_track: reasoning.rankings[0].track,
      overall_score: reasoning.overallFit,
      reasoning_trace: reasoning,
      status: 'completed',
      created_at: new Date().toISOString()
    });

    return reasoning;
  } catch (error) {
    console.error('Foundry evaluation failed:', error.message);
    throw error;
  }
}
