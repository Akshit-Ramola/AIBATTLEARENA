import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";

export const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: config.GEMINI_API_KEY
})

export const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRAL_API_KEY
})

export const cohereModel = new ChatCohere({
    model: "command-r-plus",
    apiKey: config.COHERE_API_KEY
})