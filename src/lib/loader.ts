import axios from "axios";
import OpenAI from "openai";

import { InMemoryVectorStore } from "./vectorStore";

const EMBED_MODEL = process.env.EMBED_MODEL!;
let store: InMemoryVectorStore | null = null;

export async function getVectorStore() {
  if (store) return store;
  store = new InMemoryVectorStore();

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
  const profile = res.data;

  function chunkText(str: string, size = 500) {
    const chunks: string[] = [];
    for (let i = 0; i < str.length; i += size) {
      chunks.push(str.slice(i, i + size));
    }
    return chunks;
  }

  const texts: string[] = [];
  for (const [key, value] of Object.entries(profile)) {
    const jsonString = JSON.stringify({ [key]: value }, null, 2);
    texts.push(...chunkText(jsonString));
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const embedResponse = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts
  });

  embedResponse.data.forEach((d, i) => {
    store!.add(texts[i], d.embedding);
  });

  return store;
}
