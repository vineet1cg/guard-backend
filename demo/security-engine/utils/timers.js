import { measureTime } from "./utils/timers.js";

const stop = measureTime();

// Run your engine logic
const result = analyzeInput({ inputType, content });

// Stop timer
const elapsedMs = stop();
console.log("Processing time:", elapsedMs, "ms");
