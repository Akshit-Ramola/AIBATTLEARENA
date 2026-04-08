# AI Battle Arena

AI Battle Arena is a modern, full-stack application that pits two separate Large Language Models against each other to solve user-provided problems. To ensure fairness, a third "Judge AI" evaluates both solutions and provides a definitive rating (out of 10) along with its detailed reasoning. 

This repository serves as an educational and functional example of how to orchestrate multi-agent LLM workflows gracefully inside a LangGraph infrastructure.

## Project Architecture

The project is split horizontally into two halves:
1. **Frontend**: A minimal, dark-mode focused React interface where users can chat and review judgments.
2. **Backend**: An Express.js server tightly integrated with LangChain and LangGraph for robust multi-agent orchestration.

---

### Backend Components
The backend operates a tightly controlled StateGraph that handles sequential and parallel AI calls logic seamlessly. 
- **Express.js & TypeScript**: Core HTTP server and API routing.
- **LangChain Core (`@langchain/core`)**: For interacting programmatically and building the templates with the AI models.
- **LangGraph (`@langchain/langgraph`)**: Orchestrates the multi-agent design flow. It sends the problem to both "Model 1" and "Model 2" simultaneously, and subsequently triggers the "Judge Node" to parse and critique both outputs structurally.
- **AI Providers integration**:
  - `@langchain/google` (Gemini API) -> Utilized heavily for processing.
  - `@langchain/cohere` (Cohere API)
  - `@langchain/mistralai` (Mistral API)
- **Zod (`zod`)**: Used by the Judge AI to guarantee structured output schemas (ensuring it returns numeric scores and text reasoning consistently instead of arbitrary paragraphs).

### Frontend Components
The frontend is built to highlight the comparison between the models by giving ample breathing room in its design.
- **React (`react`, `react-dom`)**: Core UI library.
- **Vite (`vite`)**: Development server and bundler.
- **Tailwind CSS (`tailwindcss`)**: Used completely to style the application. It employs a premium "Dark Mode" aesthetic with deep indigos (`#0B0E14`, `#161a21`) and glassmorphic elements.
- **Axios (`axios`)**: Handles all XMLHttpRequests fetching state and payloads securely from the Backend.

---

## How it Works

1. **User Input:** A user inputs a problem via the React Frontend (e.g. *"What is the capital of France?"*).
2. **Backend Processing:** The Frontend sends an Axios POST request to `http://localhost:3000/use-graph`.
3. **Drafting (LangGraph Node 1 & 2):** Two distinct AI models are given the user's problem. They both draft strings formulating a solution independently.
4. **Judging (LangGraph Node 3):** The third judge model analyzes the user problem alongside Solution 1 and Solution 2. Dictated by the Zod schema, the Judge parses its evaluation returning `score` and `reasoning`.
5. **UI Rendering:** The React state captures the graph cycle's output and updates the infinite scroll view elegantly highlighting Model 1's score versus Model 2's.

## Environment Variables
The application requires the following API keys securely embedded in your Backend `.env` file to function:
- `GEMINI_API_KEY`
- `MISTRAL_API_KEY`
- `COHERE_API_KEY`

## Getting Started

Start the development environments from the project root:

**Backend:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```
