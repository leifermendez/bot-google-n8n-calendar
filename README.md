[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ApzZZF?referralCode=jyd_0y)

# AI-Powered Chatbot for Appointment Scheduling

This project is an AI-powered chatbot designed for appointment scheduling, built using Node.js and the BuilderBot framework. It integrates with various services including OpenAI's GPT models, Google Calendar, and ChatPDF for enhanced functionality.

## Features

- Natural language processing for understanding user intents
- Appointment scheduling and management
- Integration with Google Calendar for real-time availability checks
- Voice note transcription and processing
- PDF querying for information retrieval
- Multi-language support

## Getting Started

### Prerequisites

- Node.js 21 or later
- pnpm package manager
- OpenAI API key
- Google Calendar API credentials
- ChatPDF API key

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/jyd-dev/builderbot-chatbot
   cd builderbot-chatbot
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   OPEN_API_KEY=your_openai_api_key
   N8N_ADD_TO_CALENDAR=your_n8n_add_calendar_webhook
   N8N_GET_FROM_CALENDAR=your_n8n_get_calendar_webhook
   CHATPDF_API=your_chatpdf_api_endpoint
   CHATPDF_KEY=your_chatpdf_api_key
   CHATPDF_SRC=your_chatpdf_source_id
   DURATION_MEET=45
   TZ=your_timezone
   ```

4. Build the project:

   ```
   pnpm build
   ```

5. Start the application:
   ```
   pnpm start
   ```

## Usage

The chatbot can be integrated into various messaging platforms. It handles user interactions, understands intents, and manages the appointment scheduling process.

Key flows include:

- Welcome flow
- Seller flow for general inquiries
- Scheduling flow for appointment booking
- Confirmation flow for finalizing appointments
- Voice note processing

## Development

For development, you can use the following command:

```
pnpm dev
```

- Use [ChatPDF](https://www.chatpdf.com/) and API [documentation](https://www.chatpdf.com/docs/api/backend)
- Use [n8nTemplates](/n8n/templates)
