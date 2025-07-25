import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const prompt = process.argv.slice(2).join(' ');

async function main() {
  const msg = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });
  console.log(msg.content);
}

main();
