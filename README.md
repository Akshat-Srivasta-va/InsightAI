# InsightAI — AI-powered Research Assistant

<div align="center">

![InsightAI Banner](https://img.shields.io/badge/InsightAI-Research%20Assistant-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

**A Chrome Extension that brings AI-powered research capabilities directly to your browser.**  
Select any text on any webpage and instantly get summaries or topic suggestions powered by Google Gemini AI.

</div>

---

## ✨ Features

- 📝 **Summarize** — Condense any selected text into a concise, clear summary
- 🔍 **Suggest Topics** — Discover related research areas and further reading
- 💾 **Research Notes** — Take and save notes locally while browsing
- 📋 **Copy Results** — One-click copy of AI-generated responses
- 🟢 **Backend Status** — Live indicator showing if the backend is running
- 🌑 **Modern Dark UI** — Premium dark-themed interface with smooth animations

---

## 🏗️ Project Architecture

```
InsightAI/
├── backend/                         # Spring Boot REST API
│   └── src/main/java/com/research/assistant/
│       ├── ResearchAssistantApplication.java   # Entry point
│       ├── ResearchController.java             # REST endpoint
│       ├── ResearchService.java                # Gemini API logic
│       ├── ResearchRequest.java                # Request model
│       ├── GeminiResponse.java                 # Response model
│       └── GlobalExceptionHandler.java         # Error handling
│
└── frontend/                        # Chrome Extension
    ├── manifest.json                # Extension config (MV3)
    ├── background.js                # Service worker
    ├── sidepanel.html               # Extension UI
    ├── sidepanel.css                # Styling
    └── sidepanel.js                 # Extension logic
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.4.2 |
| **HTTP Client** | Spring WebFlux (WebClient) |
| **AI API** | Google Gemini AI |
| **Frontend** | Chrome Extension (Manifest V3) |
| **Styling** | Vanilla CSS + Inter Font |
| **Build Tool** | Maven |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven
- Google Chrome browser
- Google Gemini API key → [Get one here](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Akshat-Srivasta-va/InsightAI.git
cd InsightAI
```

---

### 2. Set Up the Backend

#### Configure API Key

In IntelliJ IDEA:
> **Run → Edit Configurations → Environment Variables → Add:**
```
GEMINI_KEY=your_gemini_api_key_here
```

Or set it as a system environment variable:
```powershell
# Windows PowerShell
$env:GEMINI_KEY = "your_gemini_api_key_here"
```

#### Run the Spring Boot App

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**

---

### 3. Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `frontend/` folder
5. Pin the **InsightAI** icon to your toolbar

---

## 📖 How to Use

1. ✅ Make sure the Spring Boot backend is running
2. Open any webpage (Wikipedia, research papers, articles, etc.)
3. **Select any text** with your mouse
4. Click the **InsightAI icon** in Chrome toolbar
5. Click **📝 Summarize** or **🔍 Suggest Topics**
6. View the AI response in the side panel

---

## 🔌 API Reference

### `POST /api/research/process`

**Request Body:**
```json
{
  "content": "Your selected text here...",
  "operation": "summarize"
}
```

**Supported Operations:**

| Operation | Description |
|-----------|-------------|
| `summarize` | Returns a concise summary of the provided text |
| `suggest` | Returns related topics and further reading suggestions |

**Success Response:** `200 OK` with plain text AI response

**Error Responses:**
| Status | Meaning |
|--------|---------|
| `400` | Unknown operation or bad request |
| `429` | Gemini API rate limit reached |
| `500` | Internal server error |

---

## ⚙️ Configuration

`backend/src/main/resources/application.properties`

```properties
spring.application.name=research-assistant
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=
gemini.api.key=${GEMINI_KEY}
```

> ⚠️ **Never hardcode your API key in the properties file. Always use environment variables.**

---

## 🔄 After Making Code Changes

**Backend:** Restart the Spring Boot app in IntelliJ

**Frontend:** Go to `chrome://extensions/` → Click the 🔄 refresh icon on the InsightAI card

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Akshat-Srivasta-va">Akshat Srivastava</a>
</div>
