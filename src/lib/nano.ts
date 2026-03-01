import { Database } from "bun:sqlite";
import { pipeline } from "@xenova/transformers";

export class NanoVector {
  private db: Database;
  private embedder: any = null;

  constructor(path: string = ":memory:") {
    this.db = new Database(path);
    this.init();
  }

  private init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS vectors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        metadata TEXT,
        embedding BLOB NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async load() {
    if (this.embedder) return;
    console.log("Loading embedding model (Xenova/all-MiniLM-L6-v2)...");
    this.embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Model loaded. Ready to embed.");
  }

  async embed(text: string): Promise<Float32Array> {
    if (!this.embedder) await this.load();
    const output = await this.embedder(text, { pooling: 'mean', normalize: true });
    return new Float32Array(output.data);
  }

  async add(content: string, metadata: object = {}) {
    const embedding = await this.embed(content);
    
    this.db.run(
      "INSERT INTO vectors (content, metadata, embedding) VALUES (?, ?, ?)",
      [content, JSON.stringify(metadata), Buffer.from(embedding.buffer)]
    );
  }

  cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    return dot;
  }

  async search(query: string, limit: number = 5) {
    const queryVector = await this.embed(query);
    const rows = this.db.query("SELECT * FROM vectors").all();
    
    const results = rows.map((row: any) => {
      const rowVector = new Float32Array(row.embedding.buffer);
      return {
        content: row.content,
        metadata: JSON.parse(row.metadata),
        score: this.cosineSimilarity(queryVector, rowVector)
      };
    });

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
