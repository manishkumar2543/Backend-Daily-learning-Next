import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, HumanMessage, tool } from "langchain";
import { sendMail } from "./mail.service.js";
import * as z from "zod";

const emailTool = tool(sendMail, {
  name: "emailTool",
  description: "Send an email to the user",
  schema: z.object({
    to: z.string().describe("The email address to send the email to"),
    subject: z.string().describe("The subject of the email"),
    html: z.string().describe("The HTML content of the email"),
  }),
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
});

const agent = createAgent({
  model,
  tools: [emailTool],
});

const app = express();
app.use(express.json());

const chats = new Map();

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/chat", async (req, res) => {
  try {
    const { input, sessionId = "default" } = req.body ?? {};

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        error: "input is required and must be a string",
      });
    }

    const messages = chats.get(sessionId) ?? [];
    messages.push(new HumanMessage(input));

    const response = await agent.invoke({ messages });
    const assistantText = response.messages[response.messages.length - 1]?.text ?? "";

    messages.push(assistantText);
    chats.set(sessionId, messages);

    return res.json({
      sessionId,
      reply: assistantText,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
