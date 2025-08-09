# SearchPoly MVP

A minimal property search application that converts natural language queries into Trade Me Property API searches using OpenAI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file and add your API keys:
```bash
copy .env.example .env
```

3. Edit `.env` and add your API keys:
   - Get OpenAI API key from: https://platform.openai.com/api-keys
   - Get Trade Me API credentials from: https://www.trademe.co.nz/MyTradeMe/Api/RegisterNewApplication.aspx

4. Run the server:
```bash
npm start
```

5. Open http://localhost:3000 in your browser

## Usage

Type natural language queries like:
- "3-bed house in Mt Eden under $1.2m open homes this weekend"
- "2 bedroom apartment for rent in Ponsonby under $600 per week"
- "4 bedroom house in Auckland under $800k"

## API Endpoints

- `GET /` - Serves the web interface
- `POST /api/search` - Processes natural language search queries
