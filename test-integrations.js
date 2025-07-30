require('dotenv').config();
const axios = require('axios');
const Firecrawl = require('@mendable/firecrawl-js').default;

async function testClaudeRest() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 64,
        messages: [
          { role: 'user', content: 'Say hello from Claude! (REST API test)' }
        ]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );
    console.log('Claude REST API response:', response.data.content);
  } catch (error) {
    if (error.response) {
      console.error('Claude REST API test failed:', error.response.data);
    } else {
      console.error('Claude REST API test failed:', error.message);
    }
  }
}

async function testFirecrawl() {
  try {
    const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
    const result = await firecrawl.crawlUrl('https://example.com', { limit: 1 });
    console.log('Firecrawl API response:', result.success ? 'Success' : 'Failure', result);
  } catch (error) {
    console.error('Firecrawl API test failed:', error);
  }
}

(async () => {
  await testClaudeRest();
  await testFirecrawl();
})(); 