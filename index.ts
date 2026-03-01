import { NanoVector } from "./src/lib/nano";

const nv = new NanoVector("./nano.db");

console.log("--- Initializing NanoVector ---");
await nv.load();

console.log("\n--- Memorizing context ---");
await nv.add("Satyaa is a full-stack dev living in Noida. He loves Bun and Pi 5.", { source: "chat" });
await nv.add("The Raspberry Pi 5 is our production server running OpenClaw.", { type: "infra" });
await nv.add("We are building a custom vector DB called NanoVector.", { project: "nanovector" });

console.log("\n--- Searching for 'What project are we working on?' ---");
const results = await nv.search("What project are we working on?");
console.log(JSON.stringify(results, null, 2));
