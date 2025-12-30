import { normalizeCode } from "./code.js";
import { normalizeSQL } from "./sql.js";
import { normalizeConfig } from "./config.js";
import { normalizeAPI } from "./api.js";

export function normalizeInput(inputType, content, language) {
  switch (inputType) {
    case "code":
      return normalizeCode(content, language);

    case "sql":
      return normalizeSQL(content);

    case "config":
      return normalizeConfig(content);

    case "api":
      return normalizeAPI(content);

    default:
      return {
        type: "unknown",
        raw: content,
        blocks: [],
      };
  }
}
