import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const createVectorStore = (docs) =>
  MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
