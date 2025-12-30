/**
 * INPUT ROUTER
 * ------------
 * Routes input to appropriate detector group
 */

import { detectSQLInjection } from "./detectors/sqlInjection.js";
import { detectXSS } from "./detectors/xss.js";
import { detectHardcodedSecrets } from "./detectors/hardcodedSecrets.js";

export function routeInput(code) {
  return [
    ...detectSQLInjection(code),
    ...detectXSS(code),
    ...detectHardcodedSecrets(code),
  ];
}
