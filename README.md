# Mastra Palindrome Checker Helper Agent for Telex.im

An intelligent AI agent built with Mastra that helps users understand Palindrome, integrated with Telex.im using the A2A protocol.

## Features

- AI-powered palindrome checker
- Explains why a phrase, number, word is a palindrome
- Palindrome recommendations

## Prerequisites

- Node.js 20 
- GROQ API key
- Telex.im access

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your GROQ API key to `.env`:
   ```
   GROQ_API_KEY=your_key_here
   ```

## Development

Run locally:
```bash
npm run start:dev
```

Build for production:
```bash
npm run build
npm start
```

## Deployment

Deploy to mastra

## Integration with Telex.im

1. Get access: `/telex-invite your-email@example.com`
2. Deploy your agent
3. Update `workflow.json` with your deployment URL
4. Register the workflow with Telex.im
5. Test by messaging your agent on Telex

## Monitoring

Check agent logs:
```
https://api.telex.im/agent-logs/{channel-id}.txt
```

## API Endpoints

- `POST /a2a/agent/palindromeCheckerAgent` - Main agent endpoint
- `GET /health` - Health check

## License

MIT