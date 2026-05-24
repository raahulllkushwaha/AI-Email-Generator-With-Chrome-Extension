# AI Email Generator — with Chrome Extension

> Paste an email, pick a tone, and get a polished AI-generated reply in seconds — directly in your browser or Gmail inbox.

![Stack](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-brightgreen)
![Stack](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue)
![Stack](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Stack](https://img.shields.io/badge/Extension-Chrome%20MV3-yellow)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Known Bugs to Fix Before Running](#known-bugs-to-fix-before-running)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Chrome Extension Setup](#3-chrome-extension-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Chrome Extension Details](#chrome-extension-details)
- [What's Missing / Roadmap](#whats-missing--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AI Email Generator is a full-stack application that uses Google's Gemini LLM to draft professional email replies. It ships with two interfaces:

- **Web App** — a standalone React UI where you paste an email, choose a tone, and copy the generated reply.
- **Chrome Extension** — injects an "AI Reply" button directly into Gmail (and Outlook), so you can generate replies without leaving your inbox.

---

## Architecture

```
┌─────────────────────────────┐
│   Chrome Extension          │  ← Injects button into Gmail / Outlook
│   (content.js + manifest)   │
└────────────┬────────────────┘
             │ HTTP POST
             ▼
┌─────────────────────────────┐
│   React Frontend            │  ← Standalone Web UI (Vite + MUI)
│   email-generator-frontend/ │
└────────────┬────────────────┘
             │ HTTP POST  /api/email/generate
             ▼
┌─────────────────────────────┐
│   Spring Boot Backend       │  ← REST API, calls Gemini
│   AI-Email-Generater-Backend│
└────────────┬────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────┐
│   Google Gemini API         │  ← LLM that writes the reply
└─────────────────────────────┘
```

---

## Features

- Generate context-aware email replies using Google Gemini
- Five built-in tone presets: Professional, Formal, Friendly, Casual, Concise
- One-click copy of the generated reply
- Chrome Extension with Gmail and Outlook support
- Character counter on the input field
- Responsive Material UI design
- Environment-variable-based API key management (no keys in source)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 21+ |
| Maven | 3.9+ (or use the included `mvnw` wrapper) |
| Node.js | 18+ |
| npm / bun | Latest |
| Google Chrome | Latest |
| Google Gemini API Key | [Get one here](https://aistudio.google.com/app/apikey) |

---

## Project Structure

```
AI-Email-Generator-With-Chrome-Extension/
│
├── AI-Email-Generater-Backend/          # Spring Boot REST API
│   ├── src/main/java/com/rahul/
│   │   ├── config/WebClientConfig.java  # WebClient bean
│   │   ├── controller/EmailGeneratorController.java
│   │   ├── dto/EmailRequest.java        # Request payload
│   │   └── service/EmailGeneratorService.java  # Gemini integration
│   ├── src/main/resources/
│   │   └── application.properties       # Config (reads env vars)
│   └── pom.xml
│
├── email-generator-frontend/            # React + Vite web app
│   ├── src/
│   │   ├── App.jsx                      # Main UI component
│   │   └── main.jsx                     # Entry point
│   ├── public/
│   └── package.json
│
├── AI-Email-Writer/                     # Chrome Extension (MV3)
│   ├── content.js                       # Injected into Gmail/Outlook
│   ├── content.css
│   └── manifest.json
│
├── chrome-extension/                    # Starter/hello-world extension
│   ├── hello.html
│   ├── popup.js
│   └── manifest.json
│
└── README.md
```

---

## Getting Started

### 1. Backend Setup

```bash
cd AI-Email-Generater-Backend
```

Apply the bug fixes listed above, then set your environment variables and run:

**Linux / macOS:**
```bash
export GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
export GEMINI_API_KEY="your_gemini_api_key_here"

./mvnw spring-boot:run
```

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="
$env:GEMINI_API_KEY="your_gemini_api_key_here"

.\mvnw.cmd spring-boot:run
```

The backend starts on **http://localhost:8081**.

Verify it's running:
```bash
curl -X POST http://localhost:8081/api/email/generate \
  -H "Content-Type: application/json" \
  -d '{"emailContent": "Hi, can we reschedule our meeting?", "tone": "Professional"}'
```

---

### 2. Frontend Setup

```bash
cd email-generator-frontend

# Install dependencies (use npm or bun)
npm install
# or
bun install

# Start dev server
npm run dev
# or
bun run dev
```

The app opens at **http://localhost:5173**.

Make sure the backend is running on port `8081` before generating replies.

**Build for production:**
```bash
npm run build
```

---

### 3. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `AI-Email-Writer/` folder
5. Open **Gmail** — compose or reply to an email
6. You should see an **"AI Reply"** button in the compose toolbar

> **Important:** The backend must be running on `http://localhost:8081` for the extension to work.

---

## Environment Variables

The backend reads these from your system environment — never hard-code them.

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_URL` | Gemini endpoint (without key) | `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=` |
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIza...` |

---

## API Reference

### `POST /api/email/generate`

Generates an AI email reply.

**Request Body:**
```json
{
  "emailContent": "string — the original email text",
  "tone": "string — one of: Professional, Formal, Friendly, Casual, Concise (optional)"
}
```

**Response:**
```
200 OK
Content-Type: text/plain

Dear [Name],

Thank you for reaching out...
```

**Error Responses:**

| Status | Meaning |
|--------|---------|
| 500 | Gemini API error or JSON parsing failure |

---

## Chrome Extension Details

**How it works:**

1. `content.js` is injected into every `mail.google.com` and `outlook.office.com` page.
2. A `MutationObserver` watches for Gmail's compose window to open.
3. When detected, an **"AI Reply"** button is inserted into the compose toolbar.
4. Clicking it reads the current email thread content, sends it to the backend, and inserts the generated reply into the compose box.

**Supported clients:**
- Gmail (`mail.google.com`)
- Outlook Web (`outlook.office.com`)

**Permissions used:**
- `activeTab` — to interact with the current tab
- `storage` — reserved for future settings persistence

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please make sure to fix the three bugs listed above before submitting PRs — the project won't compile without them.

---

## License

This project is open source. Add your preferred license here (e.g., MIT, Apache 2.0).