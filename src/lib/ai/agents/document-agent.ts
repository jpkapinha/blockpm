import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { retrieveContext, formatContext } from "@/lib/ai/retrieval";

const documentModel = new ChatOpenAI({
  modelName: "gpt-4o", // Stronger model for document generation
  temperature: 0.4,
  configuration: {
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  },
});

import { BLOCKCHAIN_PROMPTS } from "@/lib/ai/prompts/blockchain-templates";

export async function generateDocument(projectId: string, type: string, topic: string, blockchainFocus: string = "Ethereum") {
  // 1. Retrieve Context
  const contextItems = await retrieveContext(projectId, topic);
  const contextString = formatContext(contextItems);

  // 2. Select Template Logic
  let specificInstructions = "";

  if (type === "audit") {
    specificInstructions = BLOCKCHAIN_PROMPTS.SECURITY_AUDIT;
  } else if (type === "tokenomics") {
    specificInstructions = BLOCKCHAIN_PROMPTS.TOKENOMICS_MODEL;
  } else if (type === "spec") {
    specificInstructions = BLOCKCHAIN_PROMPTS.SMART_CONTRACT_SPEC;
  } else {
    // Default PRD or generic doc
    specificInstructions = `
      Generate a document about "{topic}".
      Include standard sections for a Web3 project PRD/Spec.
      Make sure to include a section on "On-Chain Logic" vs "Off-Chain Indexing".
    `;
  }

  const promptTemplate = `
    You are an expert Blockchain Solutions Architect found of ${blockchainFocus}.

    ${BLOCKCHAIN_PROMPTS.BLOCKCHAIN_CONTEXT(blockchainFocus)}
    
    Context from project inputs:
    {context}
    
    Task:
    Generate a document for the topic: "{topic}"
    
    Specific Instructions:
    ${specificInstructions}
    
    Write in professional markdown format. Use Mermaid.js for diagrams where applicable.
  `;

  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const chain = RunnableSequence.from([prompt, documentModel, new StringOutputParser()]);

  const content = await chain.invoke({
    topic,
    context: contextString,
  });

  return content;
}
