import { v4 as uuidv4 } from "uuid";

type Doc = { id: string; text: string; embedding: number[] };

export class InMemoryVectorStore {
  private docs: Doc[] = [];

  add(text: string, embedding: number[]) {
    this.docs.push({ id: uuidv4(), text, embedding });
  }

  // cosine similarity
  private similarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
    const magB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
    return dot / (magA * magB);
  }

  // return top k texts
  nearest(embedding: number[], k = 5) {
    return this.docs
      .map((doc) => ({ ...doc, score: this.similarity(doc.embedding, embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((d) => d.text);
  }
}
