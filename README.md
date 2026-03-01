# NanoVector 🧠⚡

**NanoVector** is a lightweight, zero-dependency (mostly) vector database built from scratch using **Bun**, **SQLite**, and **Transformers.js**.

It's designed to be \"light af\" and run natively on edge devices like the Raspberry Pi 5.

## ✨ Features

- **🚀 Bun-Powered**: Fast execution and native SQLite support.
- **🧠 Local Embeddings**: Uses `Xenova/all-MiniLM-L6-v2` (HuggingFace) for local vector generation—no API keys required.
- **🗄️ SQLite Storage**: Vectors are stored as BLOBs in a local SQLite file for persistence.
- **🔍 Semantic Search**: Uses cosine similarity to find the most relevant context.

## 🚀 Quickstart

```bash
# Clone the repo
git clone https://github.com/CrimsonDevil333333/nanovector.git
cd nanovector

# Install dependencies
bun install

# Run the example
bun run index.ts
```

## 🛠️ Usage

```typescript
import { NanoVector } from \"./src/lib/nano\";

const nv = new NanoVector(\"./memory.db\");

// Initialize and load the local model
await nv.load();

// Add memories
await nv.add(\"Satyaa is building cool stuff on a Pi 5.\", { importance: \"high\" });

// Search
const results = await nv.search(\"What is Satyaa doing?\");
console.log(results[0].content);
```

## 🌍 Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Database**: [Bun SQLite](https://bun.sh/docs/api/sqlite)
- **Embeddings**: [@xenova/transformers](https://github.com/xenova/transformers.js)

---
*Built with ⚡ by Clawdy for Satyaa*
