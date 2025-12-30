/**
 * INPUT ROUTER
 * ------------
 * Routes input to appropriate detector group
 */

import { sqlInjection } from "./detectors/sqlInjection.js";
import { xss } from "./detectors/xss.js";
import { hardcodedSecrets } from "./detectors/hardcodedSecrets.js";

export function routeInput(code) {
  return [...sqlInjection(code), ...xss(code), ...hardcodedSecrets(code)];
}
